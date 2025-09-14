from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
from werkzeug.utils import secure_filename
import traceback

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def transform_insurance_data_to_claims(insurance_data):
    """Transform insurance policy data into claims development format"""
    np.random.seed(42)
    
    # Create origin years based on subscription length
    insurance_data['Origin Year'] = 2023 - np.round(insurance_data['subscription_length']).astype(int)
    insurance_data['Origin Year'] = insurance_data['Origin Year'].clip(lower=2018, upper=2023)
    
    claims_data = []
    
    # For each origin year, create development patterns
    for origin_year in sorted(insurance_data['Origin Year'].unique()):
        year_policies = insurance_data[insurance_data['Origin Year'] == origin_year]
        
        # Calculate base claim amounts based on vehicle characteristics
        base_claims = []
        for _, policy in year_policies.iterrows():
            if policy['claim_status'] == 1:  # Only for policies with claims
                base_amount = 50000  # Base amount
                
                # Adjust based on vehicle characteristics
                vehicle_age_factor = 1 + (policy['vehicle_age'] * 0.2)
                customer_age_factor = 1 + (policy['customer_age'] / 100)
                fuel_factor = 1.2 if policy['fuel_type'] == 'Diesel' else 1.0
                ncap_factor = 1.5 - (policy['ncap_rating'] * 0.1) if policy['ncap_rating'] > 0 else 1.3
                
                final_amount = base_amount * vehicle_age_factor * customer_age_factor * fuel_factor * ncap_factor
                base_claims.append(final_amount)
        
        # If no claims for this year, create some simulated claims
        if len(base_claims) == 0:
            num_claims = np.random.randint(5, 15)
            base_claims = [np.random.uniform(30000, 150000) for _ in range(num_claims)]
        
        # Create development pattern for each claim
        for base_claim in base_claims:
            for dev_year in range(1, 7):
                development_factor = 1 + (dev_year - 1) * 0.25 + np.random.normal(0, 0.1)
                development_factor = max(0.8, development_factor)
                
                paid_claims = base_claim * development_factor
                
                claims_data.append({
                    'Origin Year': origin_year,
                    'Development Year': dev_year,
                    'Paid Claims': max(0, paid_claims)
                })
    
    return pd.DataFrame(claims_data)

def create_loss_triangle(claims_data):
    """Create cumulative loss triangle from claims data"""
    triangle = claims_data.pivot_table(
        index='Origin Year',
        columns='Development Year',
        values='Paid Claims',
        aggfunc='sum',
        fill_value=0
    )
    return triangle

def calculate_ata_factors(triangle):
    """Calculate Age-to-Age development factors"""
    ata_factors = pd.DataFrame(index=triangle.index, columns=triangle.columns[1:])
    
    for dev_year in triangle.columns[1:]:
        prev_dev_year = dev_year - 1
        
        ata_factors[dev_year] = np.where(
            (triangle[prev_dev_year] > 0) & (triangle[dev_year] > 0),
            triangle[dev_year] / triangle[prev_dev_year],
            np.nan
        )
    
    return ata_factors

def calculate_selected_factors(ata_factors, method='simple_average', tail_factor=1.0):
    """Calculate selected development factors"""
    if method == 'simple_average':
        selected_factors = ata_factors.mean()
    elif method == 'weighted_average':
        # Weight by number of observations
        weights = ata_factors.count()
        selected_factors = (ata_factors * weights).sum() / weights.sum()
    elif method == 'geometric_mean':
        selected_factors = np.exp(np.log(ata_factors).mean())
    elif method == 'median':
        selected_factors = ata_factors.median()
    else:
        selected_factors = ata_factors.mean()
    
    # Add tail factor
    max_dev_year = max(ata_factors.columns)
    selected_factors[max_dev_year + 1] = tail_factor
    
    return selected_factors

def calculate_cdfs(selected_factors, triangle):
    """Calculate Cumulative Development Factors"""
    cdfs = pd.Series(index=triangle.columns, dtype=float)
    max_dev_year = max(triangle.columns)
    
    for dev_year in triangle.columns:
        cdf = 1.0
        for future_dev in range(dev_year + 1, max_dev_year + 2):
            if future_dev in selected_factors.index:
                cdf *= selected_factors[future_dev]
        cdfs[dev_year] = cdf
    
    return cdfs

def calculate_ultimate_claims(triangle, cdfs):
    """Calculate ultimate claims projections"""
    latest_claims = pd.Series(index=triangle.index, dtype=float)
    ultimate_claims = pd.Series(index=triangle.index, dtype=float)
    
    for origin_year in triangle.index:
        # Find latest development year
        latest_dev = None
        for dev_year in reversed(triangle.columns):
            if triangle.loc[origin_year, dev_year] > 0:
                latest_dev = dev_year
                break
        
        if latest_dev is not None:
            latest_claims[origin_year] = triangle.loc[origin_year, latest_dev]
            ultimate_claims[origin_year] = latest_claims[origin_year] * cdfs[latest_dev]
        else:
            latest_claims[origin_year] = 0
            ultimate_claims[origin_year] = 0
    
    return latest_claims, ultimate_claims

def calculate_ibnr_reserves(latest_claims, ultimate_claims):
    """Calculate IBNR reserves"""
    ibnr_reserves = ultimate_claims - latest_claims
    return ibnr_reserves

def format_results_for_frontend(triangle, ata_factors, selected_factors, cdfs, 
                               latest_claims, ultimate_claims, ibnr_reserves):
    """Format results for frontend consumption"""
    
    # Format triangle data
    triangle_data = {}
    for origin_year in triangle.index:
        triangle_data[str(origin_year)] = {}
        for dev_year in triangle.columns:
            triangle_data[str(origin_year)][str(dev_year)] = float(triangle.loc[origin_year, dev_year])
    
    # Format ATA factors
    ata_data = []
    for origin_year in ata_factors.index:
        row = {'origin_year': int(origin_year)}
        for dev_year in ata_factors.columns:
            value = ata_factors.loc[origin_year, dev_year]
            row[f'dev_{dev_year}'] = float(value) if not pd.isna(value) else None
        ata_data.append(row)
    
    # Format selected factors
    selected_data = []
    for dev_year, factor in selected_factors.items():
        if dev_year <= max(ata_factors.columns):
            period = f"{int(dev_year-1)} to {int(dev_year)}"
        else:
            period = "Ultimate"
        selected_data.append({
            'period': period,
            'factor': float(factor)
        })
    
    # Format CDFs
    cdf_data = []
    for dev_year, cdf in cdfs.items():
        cdf_data.append({
            'dev_year': int(dev_year),
            'cdf': float(cdf)
        })
    
    # Format results summary
    results_summary = []
    for origin_year in triangle.index:
        results_summary.append({
            'origin_year': int(origin_year),
            'latest_paid_claims': float(latest_claims[origin_year]),
            'ultimate_claims': float(ultimate_claims[origin_year]),
            'ibnr_reserve': float(ibnr_reserves[origin_year]),
            'ibnr_percentage_of_ultimate': float((ibnr_reserves[origin_year] / ultimate_claims[origin_year] * 100) if ultimate_claims[origin_year] > 0 else 0)
        })
    
    # Calculate totals
    total_ibnr = float(ibnr_reserves.sum())
    total_ultimate = float(ultimate_claims.sum())
    total_paid = float(latest_claims.sum())
    overall_ibnr_percentage = float((total_ibnr / total_ultimate * 100) if total_ultimate > 0 else 0)
    
    return {
        'triangle': triangle_data,
        'ata_factors': {
            'data': ata_data,
            'columns': [int(col) for col in ata_factors.columns]
        },
        'selected_factors': selected_data,
        'cdfs': cdf_data,
        'latest_claims_diagonal': {str(k): float(v) for k, v in latest_claims.items()},
        'results_summary': results_summary,
        'total_ibnr_reserve': total_ibnr,
        'total_ultimate_claims': total_ultimate,
        'total_paid_claims': total_paid,
        'overall_ibnr_percentage': overall_ibnr_percentage
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_claims():
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400
        
        # Get analysis options
        options = request.form.get('options', '{}')
        try:
            options = json.loads(options)
        except:
            options = {}
        
        tail_factor = options.get('tailFactor', 1.0)
        method = options.get('method', 'simple_average')
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Load and process data
        insurance_data = pd.read_csv(filepath)
        
        # Transform data for Chain-Ladder analysis
        claims_data = transform_insurance_data_to_claims(insurance_data)
        
        # Create loss triangle
        triangle = create_loss_triangle(claims_data)
        
        # Calculate ATA factors
        ata_factors = calculate_ata_factors(triangle)
        
        # Calculate selected factors
        selected_factors = calculate_selected_factors(ata_factors, method, tail_factor)
        
        # Calculate CDFs
        cdfs = calculate_cdfs(selected_factors, triangle)
        
        # Calculate ultimate claims
        latest_claims, ultimate_claims = calculate_ultimate_claims(triangle, cdfs)
        
        # Calculate IBNR reserves
        ibnr_reserves = calculate_ibnr_reserves(latest_claims, ultimate_claims)
        
        # Format results for frontend
        results = format_results_for_frontend(
            triangle, ata_factors, selected_factors, cdfs,
            latest_claims, ultimate_claims, ibnr_reserves
        )
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(results)
        
    except Exception as e:
        print(f"Error in analysis: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Claims Reserving API is running'})

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Claims Reserving Analysis API',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/analyze': 'Upload CSV file and run Chain-Ladder analysis',
            'GET /api/health': 'Health check endpoint'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

