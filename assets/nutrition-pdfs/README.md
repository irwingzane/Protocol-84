# Nutrition PDFs

Copy these 7 PDF files into **this folder** so they are bundled with the website and work for everyone who visits (not only on your device):

1. Fuel for high-output days.pdf  
2. Post-training nutrition.pdf  
3. Meal Planning Basics.pdf  
4. Fluid & Electroyltes.pdf  
5. Supplement Guide.pdf  
6. Cutting Meals.pdf  
7. Bulking Meals.pdf  

**Where to copy from:**  
Your existing files are in `Nutrition\Nutrition PDF's\` (either under `Pictures\Nutrition\` or `Pictures\web\Nutrition\`). Copy all 7 PDFs from there into this `assets/nutrition-pdfs/` folder.

**Why:**  
The app now loads PDFs from `assets/nutrition-pdfs/`, which is inside the website folder. When you deploy or share the site, this folder is deployed too, so the PDFs are served from the same origin and work for all visitors.
