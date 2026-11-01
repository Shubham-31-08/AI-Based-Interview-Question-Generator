#!/usr/bin/env python3
"""
Standalone Bundler Script for Project P_112: AI-Based Interview Question Generator
Domain: Education / Cross-Industry AI Tooling

Usage:
    python make_zip.py
"""

import os
import zipfile
from pathlib import Path

def create_project_bundle(output_zip: str = "P_112_Interview_Generator.zip") -> None:
    print("=" * 65)
    print("  🚀 Project P_112: Interview Question Generator & Rubrics")
    print("  📦 Packaging Standalone ZIP Archive")
    print("=" * 65)

    base_dir = Path(".")
    
    files_to_pack = [
        "app.py",
        "requirements.txt",
        "README.md",
        "vercel.json",
        "VERCEL_DEPLOYMENT.md",
        "package.json",
        "index.html",
        "vite.config.ts",
        "tsconfig.json",
        "src/App.tsx",
        "src/main.tsx",
        "src/index.css",
        "src/data/projectFiles.ts",
        "make_zip.py"
    ]

    zip_path = base_dir / output_zip
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename in files_to_pack:
            file_path = base_dir / filename
            if file_path.exists():
                archive_name = f"P_112_Interview_Generator/{filename}"
                zf.write(file_path, arcname=archive_name)
                print(f"  + Added to zip: {archive_name}")

    total_zip_kb = zip_path.stat().st_size / 1024
    print("\n" + "=" * 65)
    print(f"  🎉 SUCCESS! Bundle ready: {output_zip} ({total_zip_kb:.1f} KB)")
    print("=" * 65)

if __name__ == "__main__":
    create_project_bundle()
