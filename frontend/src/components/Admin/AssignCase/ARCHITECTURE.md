# AssignCase Component Architecture

## Component Hierarchy

```
AssignCase (Main Container)
│
├── ViewModeTabs
│   ├── Assign New Cases Tab (Blue theme)
│   └── Reassign Cases Tab (Purple theme)
│
├── Cases Column (Left)
│   ├── Section Header
│   ├── SearchAndFilter (with priority filter)
│   └── Cases List
│       └── CaseCard (multiple instances)
│           ├── Case ID & Priority Badge
│           ├── Description
│           ├── Crime Type, Reporter, Date
│           └── Current Assignment (if reassign mode)
│
├── Investigators Column (Right)
│   ├── Section Header
│   ├── SearchAndFilter (search only)
│   ├── InfoCard (selection-prompt)
│   ├── InfoCard (current-assignment)
│   └── Investigators List
│       └── InvestigatorCard (multiple instances)
│           ├── Status Badges (RECOMMENDED, CURRENT)
│           ├── Name & Department
│           ├── Workload Badge
│           ├── Stats (Success Rate, Avg Time)
│           └── Specialization Tags
│
├── AssignmentActionBar (Floating, conditional)
│   ├── Case Preview
│   ├── Reassignment Info (if reassign mode)
│   ├── Arrow Separator
│   ├── Investigator Preview
│   ├── Cancel Button
│   └── Assign/Reassign Button
│
└── SuccessMessage (Overlay, conditional)
    ├── Success Icon
    ├── Success Title
    └── Success Description
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      AssignCase (Main)                       │
│                                                               │
│  State:                                                       │
│  • viewMode (unassigned/reassign)                            │
│  • unassignedCases, assignedCases                            │
│  • investigators                                              │
│  • selectedCase, selectedInvestigator                        │
│  • search queries, filters                                   │
│  • isAssigning, assignmentSuccess                            │
│                                                               │
│  Functions:                                                   │
│  • handleViewModeChange()                                     │
│  • handleAssignment()                                         │
│                                                               │
└───────────────────┬───────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬───────────────┐
        │                       │               │
        ▼                       ▼               ▼
┌──────────────┐      ┌──────────────┐  ┌──────────────┐
│ ViewModeTabs │      │  CaseCard    │  │ Investigator │
│              │      │              │  │    Card      │
│ Props:       │      │ Props:       │  │              │
│ • viewMode   │      │ • caseItem   │  │ Props:       │
│ • setViewMode│      │ • isSelected │  │ • investigator│
│ • counts     │      │ • onSelect   │  │ • isSelected │
│ • onChange   │      │ • viewMode   │  │ • recommended│
└──────────────┘      │ • badges     │  │ • isCurrent  │
                      │ • formatDate │  │ • onSelect   │
                      └──────────────┘  └──────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ SearchAndFilter  │  │ AssignmentAction │  │   Success    │
│                  │  │       Bar        │  │   Message    │
│ Props:           │  │                  │  │              │
│ • searchValue    │  │ Props:           │  │ Props:       │
│ • onSearchChange │  │ • selectedCase   │  │ • show       │
│ • filterValue    │  │ • selectedInv    │  │ • viewMode   │
│ • onFilterChange │  │ • viewMode       │  │ • caseId     │
│ • placeholder    │  │ • isAssigning    │  │ • invName    │
│ • showFilter     │  │ • onAssign       │  └──────────────┘
└──────────────────┘  │ • onCancel       │
                      └──────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     Utils & Data                          │
│                                                            │
│  mockData.js:                                             │
│  • mockUnassignedCases (6 cases)                          │
│  • mockAssignedCases (4 cases)                            │
│  • mockInvestigators (5 investigators)                    │
│                                                            │
│  utils.js:                                                │
│  • getPriorityBadge(priority) → JSX                       │
│  • getWorkloadBadge(current, max) → JSX                   │
│  • formatDate(dateString) → string                        │
│  • getRecommendedInvestigators(invs, case) → sorted array│
└──────────────────────────────────────────────────────────┘
```

## User Interaction Flow

### Assign New Case Flow:
```
1. User selects "Assign New Cases" tab
   → ViewModeTabs updates viewMode to 'unassigned'
   → Main component shows unassignedCases

2. User searches/filters cases
   → SearchAndFilter updates search query
   → Main component filters casesToShow

3. User clicks on a case
   → CaseCard calls onSelect
   → Main component updates selectedCase
   → InvestigatorCards show recommendations

4. User clicks on an investigator
   → InvestigatorCard calls onSelect
   → Main component updates selectedInvestigator
   → AssignmentActionBar appears

5. User clicks "Assign Case"
   → AssignmentActionBar calls onAssign
   → Main component executes handleAssignment
   → Case moved from unassigned to assigned
   → Investigator workload increased
   → SuccessMessage appears for 2 seconds
```

### Reassign Case Flow:
```
1. User selects "Reassign Cases" tab
   → ViewModeTabs updates viewMode to 'reassign'
   → Main component shows assignedCases

2. User selects an assigned case
   → CaseCard shows current assignment
   → InfoCard shows "Currently Assigned To"
   → InvestigatorCards show recommendations
   → Current investigator marked with CURRENT badge

3. User selects different investigator
   → Cannot select same investigator (disabled)
   → AssignmentActionBar shows reassignment context

4. User clicks "Reassign Case"
   → Old investigator workload decreased
   → New investigator workload increased
   → Case assigned_to updated
   → SuccessMessage appears
```

## Recommendation Algorithm

```javascript
For each investigator:
  score = 0
  
  // Specialization match (highest priority)
  if (investigator.specialization matches case.crime_type)
    score += 50
  
  // Workload (medium priority)
  workload_percentage = current_cases / max_capacity * 100
  if (workload_percentage < 60%)
    score += 30
  else if (workload_percentage < 80%)
    score += 20
  else
    score += 10
  
  // Success rate (lower priority)
  if (success_rate > 75%)
    score += 20
  else if (success_rate > 65%)
    score += 10
  
  return sorted by score (descending)
```

## Benefits of Component Separation

### Maintainability
- Each component has a single responsibility
- Easy to locate and fix bugs
- Clear component boundaries

### Reusability
- SearchAndFilter can be used in other admin panels
- Badge utilities can be shared across components
- InfoCard supports multiple types

### Testability
- Each component can be tested in isolation
- Mock data separated from logic
- Utilities are pure functions

### Scalability
- Easy to add new features to specific components
- Can add new card types without touching main logic
- Simple to add new badge types or filters

### Readability
- Main component is now ~300 lines instead of ~600
- Each sub-component is < 150 lines
- Clear prop interfaces
- Self-documenting structure

## File Size Comparison

Before (single file):
- AssignCase.jsx: ~600 lines

After (modular):
- AssignCase.jsx: ~320 lines (main logic)
- ViewModeTabs.jsx: ~45 lines
- CaseCard.jsx: ~60 lines
- InvestigatorCard.jsx: ~115 lines
- SearchAndFilter.jsx: ~45 lines
- AssignmentActionBar.jsx: ~115 lines
- SuccessMessage.jsx: ~35 lines
- InfoCard.jsx: ~60 lines
- mockData.js: ~145 lines
- utils.js: ~85 lines
- index.js: ~12 lines
- README.md: Documentation
