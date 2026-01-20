---
name: Update General Logistics Section Logic
overview: Differentiate the Retail Program question from the General Returns question by changing the latter to a textarea with updated label and placeholder for better operational context. Add Info tooltips with program definitions.
todos:
  - id: update-general-returns-label
    content: Update label text for the general returns question to clarify it's about returns sent back
    status: pending
  - id: change-to-textarea
    content: Change the general returns input from dropdown to textarea with placeholder
    status: pending
  - id: install-lucide-react
    content: Add lucide-react package to dependencies
    status: pending
  - id: add-info-icon
    content: Add Info icon from Lucide-React next to Retail Program question label
    status: pending
    dependencies:
      - install-lucide-react
  - id: create-tooltip-definitions
    content: Create tooltip component with program definitions (DIF, ZVR, RTV)
    status: pending
    dependencies:
      - install-lucide-react
  - id: update-dropdown-options
    content: Update dropdown options to include descriptions in option text
    status: pending
  - id: style-tooltips
    content: Style tooltips to match dark navy/slate theme with high contrast and borders
    status: pending
    dependencies:
      - create-tooltip-definitions
---

# Update General Logistics Section Logic Plan

## Overview

Differentiate between the Retail Program question (dropdown) and the General Returns question (change to textarea) to eliminate redundancy and capture better operational context. Add Info tooltips with detailed program definitions.

## Implementation Details

### 1. Keep Retail Program Question Unchanged
- **File**: [src/app/rfp/page.tsx](src/app/rfp/page.tsx)
- **Location**: Around line 302-320
- Keep the conditional logic - only shows when "Do you sell into retailers?" is "Yes"
- Keep as dropdown with options: ZVR, RTV, DIF
- Keep the helper tooltip explaining the acronyms
- No changes needed for this question structure

### 2. Update General Returns Question
- **File**: [src/app/rfp/page.tsx](src/app/rfp/page.tsx)
- **Location**: Around line 322-330
- **Label Update**: Change from "What are you currently doing with your returns?" to "For returns that are sent back to you (e.g., DTC or RTV), what is your current process for handling them?"
- **Input Type Change**: Change from `<select>` dropdown to `<textarea>` multi-line input
- **Add Placeholder**: Add `placeholder="e.g., We receive them at our main warehouse, but we struggle to grade and restock them quickly..."`
- **Styling**: Use the same `input` className that other textareas use (with `min-h-[96px]` or similar)
- Keep the field name as `currentReturnsHandling` (no changes to form state needed)

### 3. Addendum: Program Definitions

#### 3.1 Install Lucide-React
- **File**: [package.json](package.json)
- Add `lucide-react` to dependencies (around line 11-15)

#### 3.2 Add Info Tooltips for Retail Program Options
- **File**: [src/app/rfp/page.tsx](src/app/rfp/page.tsx)
- **Location**: Around line 302-320 (Retail Program question)
- **Implementation**:
  - Import Info icon from lucide-react: `import { Info } from "lucide-react"`
  - Add Info icon next to the question label "If Yes, what program do you run?"
  - Create tooltip component that shows definitions on hover
  - Definitions:
    - **DIF**: Destroy in Field. The retailer destroys the product on-site instead of shipping it back, usually for a financial credit.
    - **ZVR**: Zero Value Return. Items are returned to the retailer but deemed to have no recovery value; they are typically recycled or disposed of by the retailer.
    - **RTV**: Return to Vendor. Items are shipped back to the brand's facility or 3PL for grading and potential recovery.
- **Styling**: Tooltips should match dark navy/slate theme with high contrast, borders, and be easily readable
  - Use dark background (`bg-slate-800` or `bg-slate-900`)
  - High contrast text (`text-slate-100` or `text-white`)
  - Subtle border (`border border-slate-600` or similar)
  - Shadow for depth
  - Proper z-index to appear above other elements

#### 3.3 Update Dropdown Options
- **File**: [src/app/rfp/page.tsx](src/app/rfp/page.tsx)
- **Location**: Around line 314-317
- **Implementation**:
  - Since native HTML `<select>` doesn't support rich content, include descriptions in option text
  - Update options to: "DIF - Destroy in Field", "ZVR - Zero Value Return", "RTV - Return to Vendor"
  - Update option values accordingly
  - Alternative: Show a tooltip or info box below the dropdown explaining all options

## Files to Modify

1. **[package.json](package.json)**
   - Add `lucide-react` to dependencies

2. **[src/app/rfp/page.tsx](src/app/rfp/page.tsx)**
   - Import Info icon from lucide-react
   - Update the "What are you currently doing with your returns?" Field label text
   - Replace the `<select>` element with a `<textarea>` element
   - Add placeholder attribute with the example text
   - Add Info icon next to Retail Program question label
   - Create tooltip component or enhance existing helper system to show program definitions
   - Update dropdown options to include descriptions in option text
   - Style tooltips with dark navy/slate theme with high contrast and borders
   - Ensure proper styling matches other textarea inputs in the form

## Technical Notes

- The form field name `currentReturnsHandling` remains the same, so no changes to state management or validation are needed
- The textarea should use the same styling as other textarea inputs in the form (e.g., `className="input min-h-[96px]"`)
- Native HTML `<select>` elements don't support rich content or sub-text within options, so descriptions are included in the option text itself
- For tooltips, can use CSS-based tooltips with `group` and `group-hover` classes, or a simple tooltip component
- The existing helper system uses a `title` attribute which shows native browser tooltip - we can enhance this with a custom tooltip
- Consider using `position: absolute` with proper positioning for tooltips
- Tooltip should appear on hover over the Info icon
