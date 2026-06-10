import pdfplumber

pdf_path = r'c:\Users\Salmoskie\Downloads\adzwebsite\MICHELIN.pdf'

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        print(f"\n=== PAGE {i+1} ===")
        print(text)
