import os

def extract_packing():
    with open('index_old_monolithic.html', 'r', encoding='utf-8') as f:
        content = f.read()
        
    start_marker = '<!-- EQUIPAJE / PACKING LIST -->'
    start = content.find(start_marker)
    
    if start == -1:
        print("Marker not found")
        return

    # Find the closing div of the packing section
    # It should be followed by script tags or closing body
    # Let's look for the next </div> that closes the section
    
    # Find the section div
    div_start = content.find('<div', start)
    
    # Find where the main container ends?
    # The content ends before <script src="loader.js"> (no, loader wasn't in old file)
    # It ends before <script>
    
    end = content.find('<script>', div_start)
    # Backtrack to remove closing divs of main-container if included
    # Actually, simpler: the section ends at </div> </div> (closing section, closing container)
    # Let's just grab everything until the script tag start, then trim the last few closing divs
    
    raw_section = content[div_start:end]
    
    # It probably includes the closing </div> of main-container
    # The section div is indentation level 8 spaces usually
    # Let's just write it out and trimming trailing </div> is usually fine for HTML robustness, 
    # but let's be precise if we can.
    
    # Just look for the last "</div>" before the script tag
    last_div = raw_section.rfind('</div>')
    # And the one before that (since main-container closes too)
    # actually, we want to STOP before the main-container closes.
    
    # Let's trust the simple logic: <div id="packing" class="section"> ... </div>
    # We can count divs.
    
    pos = 0
    depth = 0
    section_content = ""
    
    # Count from div_start
    # This is getting complicated for a simple extraction.
    # Let's just grab until line 7000 approx
    
    lines = content.splitlines()
    start_line = 0
    for i, line in enumerate(lines):
        if start_marker in line:
            start_line = i
            break
            
    # Packing goes until the end script tags
    # find script tag line
    end_line = len(lines)
    for i in range(start_line, len(lines)):
        if '<script>' in lines[i]:
            end_line = i
            break
    
    # Extract lines
    # Exclude the last closing div which belongs to main-container
    # The packing section closes, then main container closes.
    # So end_line - 1 should be main container closing.
    # end_line - 2 should be packing section closing?
    
    # Let's look at the last few lines
    # ...
    #     </div> <!-- end packing -->
    # </div> <!-- end main -->
    # <script>
    
    # So we want up to end_line - 1 probably.
    
    packed_lines = lines[start_line:end_line-1]
    text = '\n'.join(packed_lines)
    
    with open('sections/packing.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("✅ Extracted packing.html")

if __name__ == '__main__':
    extract_packing()

