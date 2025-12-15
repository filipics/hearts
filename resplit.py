import re
import os

def extract_section(content, start_marker, end_marker=None):
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print(f"Warning: Marker '{start_marker}' not found")
        return None
        
    # Find the actual div start
    div_start = content.find('<div', start_idx)
    
    if end_marker:
        end_idx = content.find(end_marker)
        section_content = content[div_start:end_idx]
    else:
        # For the last section, find the closing div before </body>
        # This is tricky, let's just grab until the next marker or end of container
        # Actually, let's just use the previous logic of counting divs if possible
        # Or simpler: extract until the next "<!--" comment
        next_comment = content.find('<!--', div_start)
        if next_comment != -1:
            section_content = content[div_start:next_comment]
        else:
            # Fallback
            section_content = content[div_start:]
            
    return section_content.strip()

def main():
    with open('index_old_monolithic.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Map sections to markers
    # format: (filename, start_marker, end_marker)
    sections = [
        ('sections/gastos.html', '<!-- GASTOS -->', '<!-- DOCUMENTOS -->'),
        ('sections/docs.html', '<!-- DOCUMENTOS -->', '<!-- DÍA 1: PARÍS LLEGADA -->'),
        ('days/day1.html', '<!-- DÍA 1: PARÍS LLEGADA -->', '<!-- DÍA 2: PARÍS FULL -->'),
        ('days/day2.html', '<!-- DÍA 2: PARÍS FULL -->', '<!-- DÍA 3: LONDRES -->'), # Wait, label might be different
        ('days/day3.html', '<!-- DÍA 3: LONDRES -->', '<!-- DÍA 4: BRUSELAS → LONDRES -->'), # Wait, check labels
        ('days/day4.html', '<!-- DÍA 4: BRUSELAS → LONDRES -->', '<!-- DÍA 5: LONDRES (FULL DAY 2) -->'),
        ('days/day5.html', '<!-- DÍA 5: LONDRES (FULL DAY 2) -->', '<!-- DÍA 6: TRAVEL HOME -->'),
        ('days/day6.html', '<!-- DÍA 6: TRAVEL HOME -->', '<!-- HIDDEN GEMS -->'),
        ('sections/gems.html', '<!-- HIDDEN GEMS -->', '<!-- CHECKLIST -->'),
        ('sections/checklist.html', '<!-- CHECKLIST -->', '<!-- EQUIPAJE / PACKING LIST -->'),
        ('sections/packing.html', '<!-- EQUIPAJE / PACKING LIST -->', '<!-- ============ MOBILE HEADER ============ -->') # Stop before header
    ]
    
    # Check day 3 marker in original file
    # Line 4230: <!-- DÍA 3: LONDRES --> (Original label was wrong in comments? Let's check content)
    # Actually I remember fixing labels. The original file has whatever it had.
    
    for filename, start, end in sections:
        print(f"Extracting {filename}...")
        
        # Special handling for packing which is at the end of the content block
        if 'packing' in filename:
             # Packing ends before the closing tags of the main container
             # Let's just find the start and grab until the end of that specific div
             # Simpler: Split by "<!-- " comments
             pass
        
        text = extract_section(content, start, end)
        if text:
            # Ensure directory exists
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"✅ Written {filename}")
        else:
            print(f"❌ Failed to extract {filename}")

if __name__ == '__main__':
    main()



