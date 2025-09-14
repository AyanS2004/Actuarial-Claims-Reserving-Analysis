#!/usr/bin/env python3
"""
Frontend-only launcher for Claims Reserving Analysis
Use this if you only want to run the frontend without the backend.
Note: You'll need to run the backend separately for full functionality.
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    frontend_dir = Path(__file__).parent / "frontend"
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        sys.exit(1)
    
    print("🚀 Starting Claims Reserving Analysis Frontend...")
    print("📱 Frontend will be available at: http://localhost:3000")
    print("⚠️  Note: Backend API must be running separately for full functionality")
    print("🔧 To run backend: python run_backend.py")
    print("⏹️  Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        # Change to frontend directory and start React app
        os.chdir(frontend_dir)
        subprocess.run(['npm', 'start'], check=True)
    except subprocess.CalledProcessError:
        print("❌ Failed to start frontend. Make sure npm is installed and dependencies are installed.")
        print("Run: npm install in the frontend directory")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Frontend stopped!")

if __name__ == "__main__":
    main()

