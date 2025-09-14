#!/usr/bin/env python3
"""
Backend-only launcher for Claims Reserving Analysis API
Use this if you only want to run the backend API without the frontend.
"""

import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Change to backend directory
os.chdir(backend_dir)

# Import and run the Flask app
from app import app

if __name__ == "__main__":
    print("🚀 Starting Claims Reserving Analysis Backend API...")
    print("📊 API will be available at: http://localhost:5000")
    print("🔧 Health check: http://localhost:5000/api/health")
    print("📖 API documentation: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop")
    print("-" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)

