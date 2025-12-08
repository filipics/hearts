#!/usr/bin/env python3
"""
Split the large index.html into modular files
"""
import re
import os

def split_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find where main content starts (after navigation)
    main_container_match = re.search(r'<div class="main-container"[^>]*>', content)
    if not main_container_match:
        print("ERROR: Could not find main-container")
        return
    
    header_end = main_container_match.end()
    
    # Extract header (everything before main-container content)
    header = content[:header_end]
    
    # Find where content ends (before closing body/html tags)
    footer_match = re.search(r'</div>\s*</body>', content)
    if not footer_match:
        print("ERROR: Could not find footer")
        return
    
    footer = content[footer_match.start():]
    
    # Extract the content between header and footer
    main_content = content[header_end:footer_match.start()]
    
    # Define sections to extract
    sections = {
        'gastos': ('sections/gastos.html', r'<div id="gastos" class="section">'),
        'docs': ('sections/docs.html', r'<div id="docs" class="section">'),
        'day1': ('days/day1.html', r'<div id="day1" class="section">'),
        'day2': ('days/day2.html', r'<div id="day2" class="section">'),
        'day3': ('days/day3.html', r'<div id="day3" class="section">'),
        'day4': ('days/day4.html', r'<div id="day4" class="section">'),
        'day5': ('days/day5.html', r'<div id="day5" class="section">'),
        'day6': ('days/day6.html', r'<div id="day6" class="section">'),
        'gems': ('sections/gems.html', r'<div id="gems" class="section">'),
        'checklist': ('sections/checklist.html', r'<div id="checklist" class="section">'),
        'packing': ('sections/packing.html', r'<div id="packing" class="section">'),
    }
    
    # Extract each section
    for section_id, (filepath, pattern) in sections.items():
        # Find section start
        match = re.search(pattern, main_content)
        if not match:
            print(f"WARNING: Could not find section {section_id}")
            continue
        
        start = match.start()
        
        # Find section end (next section or end of content)
        # Look for the closing </div> that matches this section
        # We need to count div depth
        pos = match.end()
        depth = 1
        while depth > 0 and pos < len(main_content):
            if main_content[pos:pos+5] == '<div ':
                depth += 1
            elif main_content[pos:pos+6] == '</div>':
                depth -= 1
                if depth == 0:
                    pos += 6
                    break
            pos += 1
        
        section_content = main_content[start:pos]
        
        # Write to file
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(section_content)
        
        print(f"✓ Created {filepath} ({len(section_content)} chars)")
    
    # Create new index.html with loader
    new_index = header + '''
        <!-- CONTENT WILL BE LOADED HERE -->
        <div id="content-container"></div>
    
    ''' + footer
    
    # Add loader script before </body>
    loader_script = '''
    <script>
        // Content loader
        async function loadSection(sectionId) {
            const container = document.getElementById('content-container');
            
            // Determine file path
            let filepath;
            if (sectionId.startsWith('day')) {
                filepath = `days/${sectionId}.html`;
            } else if (['gastos', 'docs', 'gems', 'checklist', 'packing'].includes(sectionId)) {
                filepath = `sections/${sectionId}.html`;
            } else if (sectionId === 'home') {
                filepath = 'sections/inicio.html';
            } else {
                console.error('Unknown section:', sectionId);
                return;
            }
            
            try {
                const response = await fetch(filepath);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                container.innerHTML = html;
                
                // Scroll to top
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error loading section:', error);
                container.innerHTML = `<div class="tip-box" style="background:#FEE2E2;"><h4>Error loading content</h4><p>Could not load ${filepath}</p></div>`;
            }
        }
        
        // Modified navTo function
        function navTo(sectionId, city, element) {
            // Remove active class from all menu items
            document.querySelectorAll('.desktop-menu-item, .menu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            if (element) {
                element.classList.add('active');
            }
            
            // Change background
            if (city === 'paris') {
                document.body.style.backgroundImage = 'var(--bg-paris)';
            } else if (city === 'london') {
                document.body.style.backgroundImage = 'var(--bg-london)';
            } else if (city === 'brussels') {
                document.body.style.backgroundImage = 'var(--bg-brussels)';
            }
            
            // Load content
            loadSection(sectionId);
            
            return false;
        }
        
        // Load home on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadSection('home');
        });
    </script>
    '''
    
    new_index = new_index.replace('</body>', loader_script + '\n</body>')
    
    # Save new index
    with open('index_new.html', 'w', encoding='utf-8') as f:
        f.write(new_index)
    
    print(f"\n✓ Created index_new.html")
    print("\nNext steps:")
    print("1. Review the split files")
    print("2. Create sections/inicio.html for the home page")
    print("3. Test index_new.html")
    print("4. If all looks good, replace index.html with index_new.html")

if __name__ == '__main__':
    split_html()

