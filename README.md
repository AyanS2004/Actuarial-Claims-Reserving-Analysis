# Claims Reserving Analysis - Chain-Ladder Method

A comprehensive web application for actuarial claims reserving analysis using the Chain-Ladder method. This application provides both a Jupyter Notebook for detailed analysis and a modern React frontend with Flask backend for interactive analysis.

## 🎯 Features

### Core Analysis
- **Chain-Ladder Method Implementation**: Industry-standard technique for claims reserving
- **Data Transformation**: Automatically converts insurance policy data to claims development format
- **Comprehensive Calculations**: ATA factors, CDFs, ultimate claims, and IBNR reserves
- **Professional Visualizations**: Interactive charts and tables

### User Interface
- **Modern React Frontend**: Clean, responsive design with drag-and-drop file upload
- **Interactive Dashboard**: Real-time analysis with configurable options
- **Comprehensive Results**: Tabbed interface showing summary, triangles, factors, and charts
- **Professional Reports**: Print-ready results suitable for regulatory filing

### Technical Features
- **RESTful API**: Flask backend with proper error handling
- **Data Processing**: Pandas-based data transformation and analysis
- **Visualization**: Recharts for interactive charts and graphs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

```
Actuarial Claims Reserving Analysis/
├── claims_reserving_analysis.ipynb    # Jupyter Notebook for detailed analysis
├── Insurance claims data.csv          # Sample insurance dataset
├── start_app.py                       # Integrated application launcher
├── README.md                          # This file
├── frontend/                          # React frontend application
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── Header.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FileUpload.js
│   │   │   ├── AnalysisOptions.js
│   │   │   ├── Results.js
│   │   │   ├── ResultsSummary.js
│   │   │   ├── TriangleDisplay.js
│   │   │   ├── FactorsDisplay.js
│   │   │   └── ChartsDisplay.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── node_modules/                  # Frontend dependencies
└── backend/                           # Flask backend API
    ├── app.py                         # Main Flask application
    ├── requirements.txt               # Python dependencies
    └── uploads/                       # Temporary file storage
```

## 🚀 Quick Start

### Option 1: Integrated Application (Recommended)

1. **Install Requirements**:
   ```bash
   # Install Python dependencies
   pip install -r backend/requirements.txt
   
   # Install Node.js from https://nodejs.org/
   ```

2. **Run Integrated Application**:
   ```bash
   python start_app.py
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Option 3: Jupyter Notebook Only
```bash
jupyter notebook claims_reserving_analysis.ipynb
```

## 📊 How to Use

### Web Application

1. **Upload Data**: Drag and drop your `Insurance claims data.csv` file
2. **Configure Options**: Set tail factor, development factor method, etc.
3. **Run Analysis**: Click "Run Chain-Ladder Analysis"
4. **View Results**: Explore results across four tabs:
   - **Summary**: Executive summary with key metrics
   - **Loss Triangle**: Cumulative claims development triangle
   - **Development Factors**: ATA factors, selected factors, and CDFs
   - **Visualizations**: Interactive charts and graphs

### Jupyter Notebook

1. Open `claims_reserving_analysis.ipynb` in Jupyter
2. Run all cells to see the complete analysis
3. The notebook will automatically use your `Insurance claims data.csv` file

## 📈 Data Format

The application expects insurance policy data in CSV format with columns like:
- `policy_id`: Unique policy identifier
- `subscription_length`: Policy duration in years
- `vehicle_age`: Age of insured vehicle
- `customer_age`: Age of policyholder
- `claim_status`: 0 (no claim) or 1 (claim occurred)
- `fuel_type`: Vehicle fuel type (Petrol, Diesel, CNG)
- `ncap_rating`: Vehicle safety rating
- And other vehicle characteristics

The system automatically transforms this data into the format required for Chain-Ladder analysis.

## 🔧 API Endpoints

### POST /api/analyze
Upload CSV file and run Chain-Ladder analysis.

**Request**:
- `file`: CSV file (multipart/form-data)
- `options`: JSON string with analysis options

**Response**:
```json
{
  "triangle": {...},
  "ata_factors": {...},
  "selected_factors": [...],
  "cdfs": [...],
  "results_summary": [...],
  "total_ibnr_reserve": 1234567.89,
  "total_ultimate_claims": 9876543.21,
  "total_paid_claims": 8641975.32,
  "overall_ibnr_percentage": 12.5
}
```

### GET /api/health
Health check endpoint.

## 🎨 Features in Detail

### Data Transformation
- Converts policy-level data to claims development format
- Uses vehicle characteristics to calculate realistic claim amounts
- Simulates development patterns based on actual claim status

### Chain-Ladder Analysis
- **ATA Factors**: Age-to-age development factors
- **Selected Factors**: Average development factors with configurable methods
- **CDFs**: Cumulative development factors for ultimate projections
- **IBNR Reserves**: Incurred but not reported reserves

### Visualizations
- **IBNR Reserves Chart**: Bar chart showing reserves by origin year
- **Development Pattern Chart**: Line chart showing claims development over time
- **Claims Comparison Chart**: Comparison of paid vs ultimate claims

### Professional Output
- Currency formatting with proper localization
- Print-ready reports
- Comprehensive summary tables
- Detailed factor analysis

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **Styled Components**: CSS-in-JS styling
- **Recharts**: Interactive data visualization
- **React Dropzone**: File upload with drag-and-drop
- **Axios**: HTTP client for API communication

### Backend
- **Flask**: Lightweight Python web framework
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Flask-CORS**: Cross-origin resource sharing

### Development
- **Jupyter Notebook**: Interactive data analysis
- **Python 3.8+**: Backend runtime
- **Node.js 16+**: Frontend runtime
- **npm**: Package management

## 📋 Requirements

### System Requirements
- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)
- 4GB RAM minimum
- 1GB free disk space

### Python Dependencies
```
Flask==2.3.3
Flask-CORS==4.0.0
pandas==2.0.3
numpy==1.24.3
Werkzeug==2.3.7
```

### Node.js Dependencies
```
react==18.2.0
recharts==2.5.0
axios==1.4.0
react-dropzone==14.2.3
styled-components==6.0.7
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Backend (5000): Change port in `backend/app.py`
   - Frontend (3000): React will prompt to use different port

2. **File Upload Issues**:
   - Ensure CSV file is properly formatted
   - Check file size (max 16MB)
   - Verify file has required columns

3. **Dependencies Issues**:
   - Run `pip install -r backend/requirements.txt`
   - Run `npm install` in frontend directory
   - Clear npm cache: `npm cache clean --force`

4. **Analysis Errors**:
   - Check CSV file format
   - Ensure data has claim_status column
   - Verify numeric columns are properly formatted

### Getting Help

1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure the CSV file format matches expected structure
4. Check browser developer tools for frontend errors

## 📄 License

This project is for educational and professional use in actuarial science and insurance analytics.

## 🤝 Contributing

This is a demonstration project showcasing Chain-Ladder methodology implementation. Feel free to use and modify for your actuarial analysis needs.

---

**Built with ❤️ for the actuarial community**

