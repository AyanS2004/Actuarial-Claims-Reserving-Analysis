#!/usr/bin/env python3
"""
Claims Reserving Analysis - Integrated Application Launcher
This script starts both the backend API and frontend React application.
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_requirements():
    """Check if required dependencies are installed"""
    print("🔍 Checking requirements...")
    
    # Check Python packages
    try:
        import flask
        import pandas
        import numpy
        print("✅ Python dependencies found")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r backend/requirements.txt")
        return False
    
    # Check Node.js and npm
    try:
        subprocess.run(['node', '--version'], check=True, capture_output=True)
        subprocess.run(['npm', '--version'], check=True, capture_output=True)
        print("✅ Node.js and npm found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js or npm not found")
        print("Please install Node.js from https://nodejs.org/")
        return False
    
    return True

def install_frontend_dependencies():
    """Install frontend dependencies if needed"""
    frontend_dir = Path("frontend")
    node_modules = frontend_dir / "node_modules"
    
    if not node_modules.exists():
        print("📦 Installing frontend dependencies...")
        try:
            subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True)
            print("✅ Frontend dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies")
            return False
    else:
        print("✅ Frontend dependencies already installed")
    
    return True

def start_backend():
    """Start the Flask backend API"""
    print("🚀 Starting backend API...")
    backend_dir = Path("backend")
    
    try:
        # Start backend in a separate process
        backend_process = subprocess.Popen([
            sys.executable, 'app.py'
        ], cwd=backend_dir)
        
        # Wait a moment for backend to start
        time.sleep(3)
        
        print("✅ Backend API started on http://localhost:5000")
        return backend_process
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the React frontend"""
    print("🚀 Starting frontend application...")
    frontend_dir = Path("frontend")
    
    try:
        # Start frontend in a separate process
        frontend_process = subprocess.Popen([
            'npm', 'start'
        ], cwd=frontend_dir)
        
        # Wait a moment for frontend to start
        time.sleep(5)
        
        print("✅ Frontend started on http://localhost:3000")
        return frontend_process
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Main application launcher"""
    print("=" * 60)
    print("📊 CLAIMS RESERVING ANALYSIS - INTEGRATED APPLICATION")
    print("=" * 60)
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Requirements check failed. Please install missing dependencies.")
        sys.exit(1)
    
    # Install frontend dependencies
    if not install_frontend_dependencies():
        print("\n❌ Failed to install frontend dependencies.")
        sys.exit(1)
    
    print("\n🚀 Starting integrated application...")
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ Failed to start backend. Exiting.")
        sys.exit(1)
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("\n❌ Failed to start frontend. Stopping backend.")
        backend_process.terminate()
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🎉 APPLICATION STARTED SUCCESSFULLY!")
    print("=" * 60)
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:5000")
    print("📊 Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    print("\n💡 Instructions:")
    print("1. Open http://localhost:3000 in your browser")
    print("2. Upload your Insurance claims data.csv file")
    print("3. Configure analysis options")
    print("4. Run Chain-Ladder analysis")
    print("5. View comprehensive results and visualizations")
    print("\n⏹️  Press Ctrl+C to stop the application")
    print("=" * 60)
    
    # Open browser
    try:
        webbrowser.open('http://localhost:3000')
    except:
        pass
    
    try:
        # Wait for processes
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("\n❌ Backend process stopped unexpectedly")
                break
            
            if frontend_process.poll() is not None:
                print("\n❌ Frontend process stopped unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down application...")
        
        # Terminate processes
        if backend_process:
            backend_process.terminate()
            print("✅ Backend stopped")
        
        if frontend_process:
            frontend_process.terminate()
            print("✅ Frontend stopped")
        
        print("👋 Application stopped successfully!")

if __name__ == "__main__":
    main()

