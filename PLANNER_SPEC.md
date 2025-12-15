## TripCraft Planner – Detailed UI & Behavior Spec

### 1. Overall Concept

- **Main idea**: A multi-day trip planner where:
  - **Each day is a vertical column** in the main planner view.
  - **Each column** shows: a **day header**, a **small per-day map**, and a **vertical list of time-ordered blocks** (Activities, Breaks, Transport).
  - A **left sidebar** is a **global palette** (not tied to a specific day) that shows:
    - Budget and overall stats.
    - A palette of **extra activities** and **block types** you can drag into any day.
  - You can **expand a single day** into a more focused view with:
    - Only that day’s blocks.
    - A **big per-day map**.
    - A **multi-column layout** for the blocks.
  - There is also a **global “Route” map** that shows the whole trip (all days + transport).

---

### 2. Main Planner – Multi-Day View

#### 2.1 Day Columns Layout

- **Columns container**
  - Shows **one column per day**: `Day 1 · City`, `Day 2 · City`, etc.
  - Columns are laid out **horizontally** with **horizontal scroll** if there are many days.
  - Above the columns, there is a **horizontal strip of day chips** (see section 6.1).

- **Per-day column structure (top → bottom)**
  1. **Day header**
  2. **Small per-day map**
  3. **Vertical list of time blocks**

#### 2.2 Day Header (in columns)

- **Format example**: `Day 3 · Paris → London · Tue, May 6`
  - **Pieces**:
    - **Day label**: `Day 3`.
    - **City segment**:
      - If no city change that day: `Paris`.
      - If there is a city change (transport): `Paris → London`.
    - **Date**: Human-readable (`Tue, May 6`, etc.).
    - **Compact stats** (if displayed here):
      - **Total day duration** (e.g., `09:00 – 21:00`).
      - **Number of activities**.
      - **Total cost** for that day.
  - **Interaction**:
    - Clicking the **day header** toggles **expanded day mode** for that day:
      - **From multi-day → expanded**: show only that day, big map, multi-column.
      - **From expanded → multi-day**: go back to all day columns (or via a “Back to all days” control).

#### 2.3 Per-Day Map (in columns)

- **Location**: Directly **under the day header**, inside the column.
- **Tech**: **Leaflet + OpenStreetMap**.
- **Scope**:
  - Shows markers **only for that day**:
    - Activity locations.
    - Transport endpoints (departure/arrival points).
  - No markers for other days.
- **Size & style**:
  - Small, height-limited map that fits nicely inside the column.
  - Basic controls (pan/zoom); can auto-fit (bounds) to all markers for that day.

#### 2.4 Vertical List of Time Blocks

- **What is a block?**
  - A **card** in the vertical list representing **one segment of the day**:
    - **Activity** (e.g., “Louvre Museum”).
    - **Break** (e.g., Lunch/Dinner).
    - **Transport** (e.g., Paris → London train).

- **Displayed fields per block**:
  - **Time range**: `HH:MM – HH:MM` (computed by time logic, see section 4).
  - **Title**: Activity name / “Lunch” / “Dinner” / “Transport: Paris → London”.
  - **City**: City name for that block.
  - **Duration**: Human-readable (e.g., `1h 30m`).
  - **Price**: Single activity price (or price per person, depending on your existing model).
  - **Type styling**:
    - **Activities**: Neutral border.
    - **Breaks (Lunch/Dinner)**: Warm tone (e.g., pale yellow/orange).
    - **Transport**: Cool tone (e.g., blue/purple).

- **Drag & drop behavior**:
  - **Draggable surface**:
    - The **entire block/card** is draggable. There is **no separate small handle**.
  - **Hover state**:
    - Background color changes slightly (tint).
    - Slight scale up (1–2%).
    - Cursor changes to **`grab`** to signal “you can drag this”.
  - **Drag-in-progress state**:
    - Cursor becomes **`grabbing`**.
    - Card gets a **floating look**:
      - Slight elevation shadow.
      - Slight opacity change (e.g., 0.9).
    - Other blocks move to show **a placeholder gap/line** where the block will be dropped.
  - **Reordering**:
    - You can drag blocks **up/down** within the same day to re-order them.
    - Dropping a block **recomputes times for that day** (see time logic).

- **Adding blocks from sidebar**:
  - Blocks dragged from the sidebar palette can be:
    - Inserted at a specific position **between existing blocks**.
    - Appended at the **end of the list** if dropped at the bottom.
  - Once added:
    - The new block becomes part of the day’s schedule.
    - **Time logic** recalc runs to give it a start/end time.

- **No per-column "add row" controls**:
  - The previous “add row/add block” UI **inside the column** should be **removed**.
  - **All additions** happen via **dragging from the sidebar**.

---

### 3. Left Sidebar – Global Palette

#### 3.1 General Behavior

- The sidebar is **global**, meaning:
  - It **never says** “You’re editing day X”.
  - It **does not change its text** based on which day is selected.
  - It is **always visible** in both:
    - **Multi-day view**.
    - **Expanded day view**.
- The sidebar contains:
  1. **Budget + stats** (existing behavior, can be reused).
  2. **Draggable palette**:
     - Extra activities.
     - Block types (Lunch, Dinner, Transport).

#### 3.2 Budget and Stats (top of sidebar)

- **Content** (keep existing behavior where possible):
  - Total budget / budget remaining.
  - Total trip duration (# of days).
  - Total cost so far.
  - Any other existing global stats.
- **Behavior**:
  - Read-only or with minimal interactions, as you already have.
  - Stays fixed at the **top** of the sidebar.

#### 3.3 Draggable Palette – Extra Activities

- **Section**: “Extra activities” (label can be adjusted, but concept stays).
- **Purpose**:
  - Show **suggested activities** for the selected cities that were **not chosen** by the mock AI itinerary generator.
  - Feels like **add-ons** you can drag into any day.
- **Filtering logic (conceptual)**:
  - Uses **the same filters** as your mock generator (e.g., vibe, pace, category).
  - For each city, consider all candidate activities that **match those filters**.
  - Exclude any activities that are **already used in the current itinerary**.
  - The remaining are the **extra activities**.
- **Grouping**:
  - Group extras by city:
    - Tiny headers like:
      - “More in Paris”
      - “More in London”
  - Under each header, list the cards for that city.

- **Card design**:
  - Small horizontal or vertical card with:
    - **Name** (activity title).
    - **City**.
    - **Duration**.
    - **Price**.
  - On hover:
    - Slight tint / shadow and **cursor: grab** to indicate draggable.
  - On drag:
    - Same drag visuals as time blocks (floating, shadow, placeholder where dropped).

- **Drag target**:
  - Can be dropped into:
    - Any day’s **vertical block list** (multi-day view).
    - The **expanded day block grid** (expanded view).
  - After dropping:
    - A new **Activity block** is created for that day at the chosen position.
    - Time logic will assign start/end.
    - The activity should now be considered “used” and can optionally disappear from “Extra activities” (depends on design choice).

#### 3.4 Draggable Palette – Block Types

- **Section**: “Block types” (label can be changed slightly, but concept is fixed).

- **Available block types and defaults**:
  - **Lunch**: Break block, **default duration 1 hour**.
  - **Dinner**: Break block, **default duration 1 hour**.
  - **Transport**: Transport block, **default duration 1.5 hours**.

- **Card design**:
  - Simple cards labelled:
    - “Lunch (1h)”
    - “Dinner (1h)”
    - “Transport (1.5h)”
  - On hover:
    - Tint, **cursor: grab**.
  - On drag:
    - Same floating/placeholder behavior.

- **Behavior on drop**:
  - Dropped into any day’s list or expanded grid:
    - **Lunch/Dinner**:
      - Create a **Break** block in that day.
      - Type = `lunch` or `dinner`.
      - City = day’s main city (or last non-transport block city).
      - Duration = default (1h).
    - **Transport**:
      - Create a **Transport** block in that day.
      - Use mock defaults (e.g., placeholder route `City A → City B`) unless you have extra config.
      - Duration = default (1.5h).
  - After insertion:
    - Time logic recomputes the day’s schedule.

---

### 4. Time Logic (Mock, Visible in Planner)

#### 4.1 Rules Overview

- **Day start time**:
  - Every day **starts at `09:00`**.

- **For blocks in order (top to bottom)**:
  - For each block `i` in that day:
    - If `i` is the **first block**:
      - `startTime = 09:00`.
    - Else:
      - `startTime = previousBlock.endTime + 15 minutes`.
    - `endTime = startTime + blockDuration`.

- **Applies in both views**:
  - Multi-day **vertical list**.
  - Expanded day **multi-column grid**.

#### 4.2 When to Recalculate Times

- Any time the **order of blocks** in a day changes:
  - Drag-and-drop reorder.
  - Inserting a new block from the sidebar.
  - Removing a block (if you implement deletion).
- Any time the **duration** of a block changes (if editable):
  - Time logic recomputes using the same “previousEnd + 15m” rule.

#### 4.3 Display

- Times are always **displayed on each block** as:
  - `HH:MM – HH:MM` (24h or 12h format – just be consistent).
- Somewhere in the day header or day summary, you can also show:
  - The **overall day span** (e.g., `09:00 – 21:15`).

---

### 5. Expanded Day Mode (Same Page, No Overlay)

#### 5.1 Entering and Leaving Expanded Mode

- **How to enter**:
  - Click the **day header** in the multi-day view.
  - This sets `expandedDay = that day’s ID`.

- **UI in expanded mode**:
  - **Top bar**:
    - Same TripCraft branding, navigation, etc. as in the main planner.
  - **Left sidebar**:
    - Same as main: budget + stats, plus the draggable palette.
  - **Center/right content**:
    - Shows **only the selected day**:
      - Day header (same format).
      - Block grid.
      - Big per-day map.

- **How to exit**:
  - Clicking the day header again.
  - Or using a dedicated control, e.g.:
    - A small button or chip: “Back to all days”.
  - Exiting sets `expandedDay = null` and returns to **multi-day columns** view.

#### 5.2 Layout in Expanded Mode

- **Overall layout**:
  - **Left**: Sidebar (budget + palette).
  - **Center**: Expanded day block grid.
  - **Right**: Big per-day map for that day.

#### 5.3 Big Per-Day Map (Expanded View)

- **Tech**: Same Leaflet + OpenStreetMap setup.
- **Scope**:
  - Same as per-day column map, but just **larger**:
    - Only **that day’s** activities and transport endpoints.
  - Auto-fit to show all markers clearly.
- **Interactions**:
  - Standard leaflet interactions: zoom, pan.
  - Optional: hover a block to highlight its marker (if you want to wire it later).

#### 5.4 Multi-Column Block Layout

- **Grid pattern**:
  - Blocks are laid out like reading a book:
    - **Row 1**: Block 1 | Block 2
    - **Row 2**: Block 3 | Block 4
    - **Row 3**: Block 5 | Block 6
    - Etc.
  - Order is **left-to-right**, **top-to-bottom**.
  - Internally, the sequence of blocks is still **one linear list**; the grid is just a visual layout.

- **Block size & behavior**:
  - Same block design and dimensions as in the multi-day vertical list (times, title, city, duration, price).
  - Each block is **still draggable as a full card**.

- **Drag & drop in grid**:
  - You can drag blocks **within the grid** to re-order:
    - Reordering in the grid changes their **underlying order** (1D list).
    - After drop, the **time logic** recomputes start/end times for the day.
  - You can also accept drops from:
    - The sidebar palette (extra activities / block types).
  - Visual cues:
    - Placeholder position where the block will land.
    - Other blocks smoothly reflow in the grid.

---

### 6. Global & Navigation Features

#### 6.1 Horizontal Days Strip + Top Scroll

- **Location**:
  - Above the main columns container.

- **Appearance**:
  - A horizontal strip of “chips” or buttons:
    - `[Day 1 · Paris] [Day 2 · Paris] [Day 3 · London] …`
  - Scrollable horizontally (overflow-x).

- **Behavior**:
  - **Mouse and trackpad horizontal scroll** works on this strip.
  - Clicking a chip:
    - In **multi-day view**:
      - Scrolls the **columns container** so that the corresponding day’s column is brought into view.
    - In **expanded view**:
      - Switches `expandedDay` to that day and updates the center and map accordingly.

#### 6.2 Global Map vs Per-Day Maps

- **Per-day maps**:
  - In **multi-day view**:
    - A **small map inside each column**, under the header.
    - Only shows that day’s markers (activities + transport).
  - In **expanded view**:
    - A **big per-day map** on the side (right).
    - Only shows that day’s markers.

- **Global map (Route view)**:
  - Reuses your **existing side-panel map**.
  - It turns into a **“Route” view** when opened via an icon in the header.
  - The Route view shows:
    - **Entire trip**:
      - All cities.
      - All transport segments (e.g., lines between cities).
    - Optional:
      - Key activities for each city.
  - This Route view is a **separate panel or mode**, not the same as per-day maps.

#### 6.3 Travel-Heavy Day Indicator

- **Definition**:
  - A day is considered “travel-heavy” if it contains at least one **long Transport block**.
  - You can define “long” using a threshold (e.g., ≥ 3 hours), or just mark any transport-only day.

- **UI**:
  - In the **day header**, add a **subtle icon** when the day is travel-heavy.
    - Example: a small train icon, or text icon like `🚆 Travel-heavy`.
  - Purpose:
    - Helps users quickly see which days are dominated by travel and may need adjustments or more rest.

---

### 7. Landing Page – Direct Jump to Planner

#### 7.1 New Landing CTA

- On the landing page (before onboarding questions), add a **second clear button**, e.g.:
  - “Try the planner (demo trip)” **or**
  - “Skip questions”.

- The two major CTAs become:
  - **Existing**: Start normal onboarding (questions, preferences).
  - **New**: Jump straight into a **demo planner** with predefined mock data.

#### 7.2 Behavior of the New Button

- On click:
  - Call the planner with **hard-coded mock preferences**, e.g.:
    - **Cities**: Paris + London
    - **Dates**: 5 days
    - **Group**: Couple, 2 people
    - **Vibes**: Art, Food
    - **Pace**: Moderate
  - Immediately generate a **mock itinerary** using your existing mock generator logic (or a new mocked function).
  - Navigate the user **directly into the planner view**, **skipping onboarding**.

---

### 8. Interaction & UX Details

#### 8.1 Color-Coding Block Types

- **Activities**:
  - Neutral border or subtle accent (e.g., gray border, white background).
- **Breaks (Lunch/Dinner)**:
  - Warm tones:
    - E.g., pale yellow/orange background or border.
- **Transport**:
  - Cool tones:
    - E.g., pale blue or light purple background/border.

- **Effect**:
  - Without reading any labels, you can **visually scan**:
    - See where the breaks are (warm blocks).
    - Spot long travel sections (cool blocks).

#### 8.2 Hover & Drag Feel

- **On hover (non-drag)**:
  - Slight background tint (lightly colored overlay).
  - Slight scale up (1–2%).
  - Cursor: **`grab`**.

- **On drag**:
  - Cursor: **`grabbing`**.
  - Card:
    - Slightly elevated shadow.
    - Opacity reduced slightly (~0.9).
  - Placeholder:
    - Clear visual placeholder where the card will land:
      - Could be an empty card slot, dashed outline, or a highlighted line between blocks.

#### 8.3 Smart “Extra Activities” Sidebar Behavior

- **Source**:
  - Same data you use for generating the initial itinerary.
  - Same filters: cities, vibes, pace, etc.

- **Filtering**:
  - Remove:
    - Activities that are already scheduled in any day.
    - Activities that don’t match the current trip’s constraints.
  - Keep:
    - Remaining “good fit” activities as **extras**.

- **Grouping & labeling**:
  - Group by city:
    - “More in Paris”
    - “More in London”
  - List 3–10 items per city (depending on data).
  - Card fields: name, city, duration, price.

---

## Implementation Plan – Step-by-Step Coding Guide

Below is a concrete series of steps to implement everything above. This assumes you already have:
- A working **landing page**.
- A **planner page** with days/itinerary.
- A basic **Leaflet map** integration and some mock data logic.

### Step 1 – Prepare Data Structures

1. **Normalize trip data model**:
   - Ensure each **day** has:
     - `id`, `date`, `city` (or cities if travel day), list of `blocks`.
   - Ensure each **block** has at least:
     - `id`
     - `type` (`"activity" | "break" | "transport"`)
     - `title`
     - `city`
     - `durationMinutes`
     - `price`
     - `location` (for map: lat/lng, where applicable)
2. **Add time fields (computed)**:
   - Add optional `startTime` and `endTime` fields or compute them on the fly in a helper function.

### Step 2 – Implement Time Logic Helper

1. **Create a helper function**, e.g. `computeDaySchedule(blocks)`:
   - Input: ordered list of blocks (for one day).
   - Output: same list annotated with `startTime` and `endTime`.
2. **Implement algorithm**:
   - Start at `09:00`.
   - For each block:
     - If first: `start = 09:00`.
     - Else: `start = previousEnd + 15min`.
     - `end = start + duration`.
3. **Hook into rendering**:
   - Use this helper in:
     - The **multi-day column view**.
     - The **expanded day grid view**.

### Step 3 – Refactor Multi-Day Columns

1. **Adjust the day columns component**:
   - Ensure each column renders:
     - Header.
     - Small per-day map.
     - Vertical block list.
2. **Insert per-day map component**:
   - Create a reusable `DayMap` component:
     - Props: `blocks` for that day or a list of markers.
     - Internally uses Leaflet + OSM.
3. **Convert old big cards into time blocks**:
   - Replace old per-activity cards with new **BlockCard** component:
     - Shows time, title, city, duration, price.
     - Colored by `type`.

### Step 4 – Set Up Drag & Drop for Blocks

1. **Choose a drag & drop library** (or continue with what you already use).
2. **Make BlockCard draggable**:
   - Entire card is a drag handle.
   - Apply hover/drag styles (cursor, shadow, scale).
3. **Implement reordering**:
   - On drop, update the **order of blocks** in that day’s array.
   - After updating, **re-run the time logic helper**.

### Step 5 – Remove In-Column “Add Row” UI

1. **Delete or disable existing “add row/add block” controls** in each column.
2. **Confirm UX**:
   - All new blocks now come **only** from dragging palette cards from the sidebar.

### Step 6 – Implement Sidebar Palette (Extra Activities + Block Types)

1. **Sidebar structure**:
   - Keep **budget + stats** at the top.
   - Under that, add two sections:
     - “Extra activities”
     - “Block types”
2. **Extra activities logic**:
   - Implement a function that:
     - Takes all available activities (per city, from your dataset).
     - Filters by current trip constraints and excludes already-used activities.
   - Group them into:
     - `extrasByCity = { cityName: [activity, ...] }`.
3. **Cards for extra activities**:
   - Create a `PaletteActivityCard`:
     - Shows name, city, duration, price.
     - Draggable.
4. **Block types cards**:
   - Create static `PaletteBlockTypeCard`s for:
     - Lunch (1h), Dinner (1h), Transport (1.5h).
5. **Drag behavior**:
   - When dropped into a day:
     - **Extra activity card** → add new `activity` block with that data.
     - **Lunch/Dinner** → add `break` block with default duration.
     - **Transport** → add `transport` block with default duration (and placeholder route).
   - Re-run the time logic for that day.

### Step 7 – Implement Expanded Day Mode

1. **State**:
   - Add an `expandedDayId` state in your planner:
     - `null` → multi-day view.
     - `dayId` → expanded view for that day.
2. **Toggle logic**:
   - Clicking a day header:
     - If `expandedDayId === clickedDayId` → set to `null`.
     - Else → set `expandedDayId = clickedDayId`.
3. **View switch**:
   - If `expandedDayId` is `null`:
     - Render **multi-day columns**.
   - Else:
     - Render **single-day expanded layout**:
       - Same header (with optional “Back to all days” button).
       - Left sidebar unchanged.
       - Center: block grid.
       - Right: big `DayMap`.

### Step 8 – Implement Multi-Column Block Grid in Expanded View

1. **Layout**:
   - Use CSS grid or flexbox with 2 columns.
   - Map the **linear block list** into grid cells:
     - Index 0 → row 1, col 1.
     - Index 1 → row 1, col 2.
     - Index 2 → row 2, col 1.
     - Index 3 → row 2, col 2.
2. **Drag & drop**:
   - Re-use the same BlockCard component as in the vertical list.
   - Drag events still reorder the underlying 1D list.
3. **Time logic**:
   - After reordering, recompute times via the helper.
   - Display updated start/end on each card.

### Step 9 – Integrate Per-Day Maps (Small + Big)

1. **DayMap component**:
   - Accepts a list of blocks.
   - Extracts all blocks that have a `location`.
   - Renders markers for each.
   - Fits bounds to all markers.
2. **Usage**:
   - **Multi-day view**:
     - Place a small `DayMap` under each day header.
   - **Expanded view**:
     - Place a large `DayMap` on the right side.

### Step 10 – Implement Horizontal Days Strip + Scroll

1. **Create a DaysStrip component**:
   - Renders chips: `[Day N · City]`.
   - Scrollable horizontally with `overflow-x: auto`.
2. **Click behavior**:
   - In multi-day view:
     - Scroll the columns container to the correct column (use `ref` and `scrollIntoView`).
   - In expanded view:
     - Set `expandedDayId` to the clicked day.

### Step 11 – Global Route Map View

1. **Trigger**:
   - Add a **map/route icon** in the top header.
   - Clicking it opens the **Route view** (side panel or full-screen).
2. **Content**:
   - Use Leaflet to:
     - Plot all cities as markers.
     - Draw transport segments between cities as polylines.
3. **Mode switch**:
   - This Route view is **independent** of per-day maps; just reuse your map component with different data.

### Step 12 – Travel-Heavy Indicator

1. **Detection**:
   - For each day, compute:
     - Whether it has any `transport` block over a configurable threshold (e.g., ≥ 3 hours).
2. **UI**:
   - If travel-heavy:
     - Show a small icon in the day header (e.g., `🚆` + text “Travel-heavy”).

### Step 13 – Landing Page “Try Planner (Demo Trip)” Button

1. **UI change**:
   - On the landing page, add a second CTA button:
     - E.g., “Try the planner (demo trip)”.
2. **Click behavior**:
   - On click:
     - Build a set of **mock preferences**:
       - Cities: Paris + London.
       - Days: 5.
       - Group: Couple, 2 people.
       - Vibes: Art, Food.
       - Pace: Moderate.
     - Call the mock itinerary generator with those preferences.
     - Navigate to the planner page with this generated itinerary.

### Step 14 – Polishing & UX Refinements

1. **Styling**:
   - Fine-tune colors for activities, breaks, and transport so they look good together.
   - Ensure hover and drag states feel smooth (CSS transitions).
2. **Performance**:
   - Optimize map rendering:
     - Avoid re-initializing Leaflet instance too often.
3. **Edge cases**:
   - Days with **no blocks** (show an empty-state message and allow drops).
   - Trips with many days (check horizontal scroll UX).
   - Very long or very short activities (time labels still readable).

---

## How You Can Use This Document

- **As a spec**: This describes how the planner should behave visually and logically.
- **As a roadmap**: The implementation steps (Steps 1–14) can be tackled one by one.
- **As a checklist**: You can tick off each step once implemented to track progress.




