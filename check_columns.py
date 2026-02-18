import os
import openpyxl

folder = 'Tablas de Sharepoint'
files = [f for f in os.listdir(folder) if f.endswith('.xlsx')]

for file in files:
    path = os.path.join(folder, file)
    try:
        wb = openpyxl.load_workbook(path, data_only=True)
        sheet = wb.active
        headers = []
        for cell in sheet[1]:
            headers.append(cell.value)
        print(f"File: {file}")
        print(f"Headers: {headers}")
        print("-" * 20)
    except Exception as e:
        print(f"Error reading {file}: {e}")

with open('headers_utf8.txt', 'w', encoding='utf-8') as f:
    for file in files:
        path = os.path.join(folder, file)
        try:
            wb = openpyxl.load_workbook(path, data_only=True)
            sheet = wb.active
            headers = []
            for cell in sheet[1]:
                headers.append(cell.value)
            f.write(f"File: {file}\n")
            f.write(f"Headers: {headers}\n")
            f.write("-" * 20 + "\n")
        except Exception as e:
            f.write(f"Error reading {file}: {e}\n")
