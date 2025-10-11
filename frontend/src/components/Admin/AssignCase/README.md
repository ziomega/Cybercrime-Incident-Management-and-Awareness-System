# AssignCase Component Structure

This directory contains the refactored AssignCase component, broken down into smaller, reusable sub-components.

## File Structure

```
AssignCase/
├── index.js                    # Barrel export file
├── mockData.js                 # Mock data for cases and investigators
├── utils.js                    # Utility functions (badges, date formatting, recommendations)
├── ViewModeTabs.jsx            # Tabs for switching between assign/reassign modes
├── CaseCard.jsx                # Individual case display card
├── InvestigatorCard.jsx        # Individual investigator display card
├── SearchAndFilter.jsx         # Search and filter controls
├── AssignmentActionBar.jsx     # Floating action bar for confirming assignments
├── SuccessMessage.jsx          # Success notification overlay
└── InfoCard.jsx                # Information cards (prompts, current assignment)
```

## Components

### Main Component
**AssignCase.jsx** - Main container component that orchestrates all sub-components
- Manages state for cases, investigators, selections, and filters
- Handles assignment logic and API simulation
- Renders the grid layout with two columns (cases and investigators)

### Sub-Components

#### ViewModeTabs.jsx
Switch between "Assign New Cases" and "Reassign Cases" modes.
- **Props**: `viewMode`, `setViewMode`, `unassignedCount`, `assignedCount`, `onModeChange`
- **Features**: Tab navigation with case counts, color-coded themes

#### CaseCard.jsx
Displays individual case information in a card format.
- **Props**: `caseItem`, `isSelected`, `onSelect`, `viewMode`, `getPriorityBadge`, `formatDate`
- **Features**: Priority badges, case details, current assignment display (reassign mode)

#### InvestigatorCard.jsx
Displays individual investigator information with stats and badges.
- **Props**: `investigator`, `isSelected`, `isRecommended`, `isCurrent`, `hasSelectedCase`, `selectedCase`, `viewMode`, `onSelect`, `getWorkloadBadge`, `index`
- **Features**: Recommendation badges, workload indicators, success rate, specialization tags

#### SearchAndFilter.jsx
Reusable search and filter controls.
- **Props**: `searchValue`, `onSearchChange`, `filterValue`, `onFilterChange`, `searchPlaceholder`, `showFilter`
- **Features**: Search input, priority filter dropdown, optional filter visibility

#### AssignmentActionBar.jsx
Floating action bar at the bottom for confirming assignments.
- **Props**: `selectedCase`, `selectedInvestigator`, `viewMode`, `isAssigning`, `onAssign`, `onCancel`
- **Features**: Assignment preview, cancel/confirm buttons, loading states, mode-specific styling

#### SuccessMessage.jsx
Success notification overlay after assignment.
- **Props**: `show`, `viewMode`, `caseId`, `investigatorName`
- **Features**: Animated appearance, auto-dismiss, mode-specific messaging

#### InfoCard.jsx
Multi-purpose information card component.
- **Props**: `type`, `viewMode`, `selectedCase`, `formatDate`
- **Types**: 
  - `selection-prompt` - Prompt to select a case
  - `current-assignment` - Shows current assignment info in reassign mode

### Data & Utilities

#### mockData.js
Contains mock data arrays:
- `mockUnassignedCases` - Array of 6 unassigned cases
- `mockAssignedCases` - Array of 4 assigned cases
- `mockInvestigators` - Array of 5 investigators with stats and specializations

#### utils.js
Utility functions:
- `getPriorityBadge(priority)` - Returns JSX for priority badge
- `getWorkloadBadge(currentCases, maxCapacity)` - Returns JSX for workload badge
- `formatDate(dateString)` - Formats date to readable string
- `getRecommendedInvestigators(filteredInvestigators, selectedCase)` - Returns sorted investigators based on recommendation score

## Usage

### Import the main component
```jsx
import AssignCase from './components/Admin/AssignCase';

// Use in your app
<AssignCase />
```

### Import sub-components (if needed separately)
```jsx
import { CaseCard, InvestigatorCard, SearchAndFilter } from './components/Admin/AssignCase';
```

### Import utilities
```jsx
import { getPriorityBadge, formatDate, getRecommendedInvestigators } from './components/Admin/AssignCase/utils';
```

## State Management

The main component manages all state:
- `viewMode` - Current view ('unassigned' or 'reassign')
- `unassignedCases` - Array of unassigned cases
- `assignedCases` - Array of assigned cases
- `investigators` - Array of available investigators
- `selectedCase` - Currently selected case
- `selectedInvestigator` - Currently selected investigator
- `searchCaseQuery` - Search query for cases
- `searchInvestigatorQuery` - Search query for investigators
- `priorityFilter` - Priority filter value
- `isAssigning` - Loading state during assignment
- `assignmentSuccess` - Success notification state

## Features

### Dual Mode Operation
1. **Assign Mode** (Blue Theme)
   - Shows unassigned cases
   - Allows assigning to investigators
   - Moves case from unassigned to assigned list

2. **Reassign Mode** (Purple Theme)
   - Shows assigned cases
   - Shows current assignment
   - Allows reassigning to different investigator
   - Prevents reassigning to same investigator
   - Updates workload counts for both old and new investigators

### Smart Recommendations
The recommendation algorithm scores investigators based on:
- **Specialization match** (+50 points) - Case type matches investigator expertise
- **Workload** (+10-30 points) - Lower workload gets higher score
- **Success rate** (+10-20 points) - Higher success rate gets higher score

### Visual Indicators
- **RECOMMENDED** badge - Green, appears on investigators with matching specialization
- **CURRENT** badge - Orange, shows current assignee in reassign mode
- **Priority badges** - Red (high), Yellow (medium), Blue (low)
- **Workload badges** - Green (available), Yellow (moderate), Red (busy)

## API Integration

To connect to a real backend:
1. Replace mock data imports in `AssignCase.jsx`
2. Add API calls in `handleAssignment` function
3. Add useEffect hooks for data fetching
4. Update state management to handle API responses

Example:
```jsx
// Replace mock data
useEffect(() => {
  fetchUnassignedCases().then(setUnassignedCases);
  fetchInvestigators().then(setInvestigators);
}, []);

// Update handleAssignment
const handleAssignment = async () => {
  try {
    await assignCaseAPI(selectedCase.id, selectedInvestigator.id);
    // Update local state
  } catch (error) {
    // Handle error
  }
};
```

## Styling

- **Dark Theme** - Black backgrounds with gray borders
- **Color-coded modes** - Blue for assign, Purple for reassign, Orange for current
- **Framer Motion** - Smooth animations and transitions
- **Custom scrollbar** - Styled scrollbar for lists
- **Responsive** - Grid layout adapts to screen size

## Dependencies

- React 19.1.1
- Framer Motion 12.23.22
- Lucide React 0.544.0
- Tailwind CSS 4.1.14
