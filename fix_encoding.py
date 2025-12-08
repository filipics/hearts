import os
import glob

def fix_encoding(filepath):
    try:
        # Read bytes directly
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
            
        # Remove BOM if present
        if raw_bytes.startswith(b'\xef\xbb\xbf'):
            raw_bytes = raw_bytes[3:]
            
        # Decode as UTF-8 to get the string (which contains the garbage characters)
        content = raw_bytes.decode('utf-8')
        
        # Now perform the fix: encode to latin1/cp1252 to restore original bytes
        try:
            # The garbage characters like 'Ã' map back to bytes via cp1252/latin1
            original_bytes = content.encode('cp1252')
        except UnicodeEncodeError:
            try:
                original_bytes = content.encode('latin1')
            except UnicodeEncodeError:
                # If we still can't encode, maybe it's not corrupted or mixed
                print(f"⚠️  Skipping {filepath}: Could not reverse-encode (mixed content?)")
                return

        # Now decode those bytes as UTF-8 to get the real characters
        fixed_content = original_bytes.decode('utf-8')
            
        # Write back as clean UTF-8 without BOM
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"✅ Fixed: {filepath}")
            
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {str(e)}")

# Files to process
files = ['index.html', 'loader.js']
files.extend(glob.glob('days/*.html'))
files.extend(glob.glob('sections/*.html'))

print("🔧 Starting encoding repair (Attempt 2)...")
for file in files:
    if os.path.exists(file):
        fix_encoding(file)
print("✨ Done!")
