
import os

html_path = '/home/sitapp/Documentos/CyberRiskControlCenter/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_large_script = False
script_started = False

# We want to remove the script block starting around line 2351
for i, line in enumerate(lines):
    line_num = i + 1
    # Check for the start of the inline script (approx 2351)
    if line_num == 2351 and '<script>' in line:
        in_large_script = True
        script_started = True
        # Inject new modular scripts
        new_lines.append('    <!-- Modular Scripts -->\n')
        new_lines.append('    <script src="js/auth.js"></script>\n')
        new_lines.append('    <script src="js/projects.js"></script>\n')
        new_lines.append('    <script src="js/controls.js"></script>\n')
        new_lines.append('    <script src="js/rcs.js"></script>\n')
        new_lines.append('    <script src="js/risks.js"></script>\n')
        new_lines.append('    <script src="js/informes.js"></script>\n')
        new_lines.append('    <script src="js/procesos.js"></script>\n')
        new_lines.append('    <script src="js/main.js"></script>\n')
        continue
    
    # Check for the end of the inline script (approx 4119) and the app.js line (4120)
    if in_large_script:
        if '</script>' in line and line_num >= 4110:
            in_large_script = False
        continue
    
    # Also skip the old app.js tag if it comes right after
    if not in_large_script and script_started and 'script src="app.js"' in line:
        continue
        
    new_lines.append(line)

with open(html_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Updated {html_path} successfully.")
