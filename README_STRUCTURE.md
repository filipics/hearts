# EuroTrip 2026 - Modular Structure

## File Organization

```
eurotrip26/
├── index.html              # Main file with styles, nav, and loader
├── days/
│   ├── day1.html          # Paris Arrival
│   ├── day2.html          # Paris Full Day
│   ├── day3.html          # Brussels & Bruges
│   ├── day4.html          # London Day 1
│   ├── day5.html          # London Day 2
│   └── day6.html          # Travel Home
├── sections/
│   ├── inicio.html        # Welcome/Home section
│   ├── docs.html          # Documentation
│   ├── gastos.html        # Budget
│   ├── gems.html          # Hidden Gems
│   ├── checklist.html     # Checklist
│   └── packing.html       # Packing List
└── index_backup.html      # Original backup

## How It Works

1. **index.html** contains:
   - All CSS styles
   - Navigation (sidebar + mobile)
   - JavaScript loader function
   - Empty content container

2. **Content files** contain:
   - Only the HTML for that specific section
   - No styles, no navigation
   - Just the `<div class="section">` content

3. **Loading mechanism**:
   - Click navigation → JavaScript fetches the file
   - Injects content into main container
   - Applies active states

## Benefits

✅ Easy to edit individual days without breaking others
✅ Smaller files = faster to work with
✅ Clear separation of concerns
✅ Can track changes per day in git
✅ AI can edit one file at a time safely

