# Investigator Dashboard Components

Complete dashboard system for investigators to manage their cases and track activities.

## Components Overview

### 1. Dashboard.jsx (Main Container)
Main component that handles tab navigation and renders appropriate sub-components.

**Features:**
- Tab-based navigation using RoleBasedTab
- Dynamic content rendering based on active tab
- Integrates all investigator-specific components

**Tabs:**
- Overview - Dashboard overview with stats and recent activity
- Assigned Cases - List of all assigned cases
- Activity Log - Detailed activity timeline
- Evidence - Evidence management (placeholder)
- Reports - Report generation (placeholder)
- Messages - Communication hub (placeholder)

---

### 2. InvestigatorOverview.jsx
Main dashboard view showing key metrics and recent activities.

**Features:**
- **Stats Cards:**
  - Total Cases assigned
  - Cases In Progress
  - Cases Resolved
  - Success Rate percentage

- **Performance Metrics:**
  - Average Resolution Time (days)
  - Cases This Month count
  - Comparison with benchmarks

- **Recent Activity Feed:**
  - Latest case updates
  - Evidence uploads
  - Status changes
  - New assignments

- **Upcoming Deadlines:**
  - Cases approaching deadline
  - Priority indicators
  - Days remaining countdown

**Visual Elements:**
- Gradient backgrounds
- Animated cards with Framer Motion
- Color-coded status indicators
- Award badge for rank/designation

---

### 3. MyCases.jsx
Comprehensive case management interface showing all assigned cases.

**Features:**
- **Case Display:**
  - Case ID and title
  - Description preview
  - Crime type classification
  - Priority badges (High/Medium/Low)
  - Status badges (In Progress/Under Review/Resolved/Closed)

- **Progress Tracking:**
  - Visual progress bar (0-100%)
  - Evidence count
  - Updates count
  - Days until deadline with color coding

- **Case Information:**
  - Reported by (victim email)
  - Location
  - Assignment date
  - Deadline date

- **Search & Filter:**
  - Real-time search across case details
  - Filter by status (All/In Progress/Under Review/Resolved/Closed)

- **Actions:**
  - View Details button
  - Quick Edit button
  - Responsive grid layout

**Status Colors:**
- In Progress: Blue
- Under Review: Yellow
- Resolved: Green
- Closed: Gray

**Priority Levels:**
- High: Red background
- Medium: Yellow background
- Low: Blue background

**Mock Data:**
- 4 sample cases with different statuses
- Realistic case details and timelines
- Various crime types

---

### 4. ActivityLog.jsx
Detailed activity timeline with:

**Features:**
- **Activity Types:**
  - Case Updates (status changes, progress)
  - Evidence Uploads
  - Messages (victim communication)
  - New Assignments
  - Report Submissions

- **Filter Tabs:**
  - All Activities
  - Case Updates only
  - Evidence uploads only
  - Messages only
  - Assignments only
  - Reports only

- **Activity Details:**
  - Action title
  - Detailed description
  - User who performed action
  - Case ID reference
  - Timestamp (relative and absolute)
  - Color-coded icons

- **Export Feature:**
  - Export log button
  - Download activity history

**Color Coding:**
- Case Updates: Yellow/Blue
- Evidence: Blue
- Messages: Purple
- Assignments: Orange
- Reports: Indigo
- Success Actions: Green

**Timeline Display:**
- Chronological order (newest first)
- Icon-based visual indicators
- Grouped by action type
- Hover effects for interactivity

---

### 5. Evidence.jsx
Comprehensive evidence management system.

**Features:**
- **Evidence Display:**
  - File type icons (Documents, Images, Videos)
  - File name and size
  - Upload date and uploader
  - Case association
  - Status badges (Verified/Pending/Rejected)
  - Tags for categorization

- **Stats Dashboard:**
  - Total Evidence count
  - Verified count
  - Pending review count
  - Total storage size

- **Search & Filter:**
  - Search by filename, description, tags
  - Filter by case ID
  - Filter by file type (Document/Image/Video)

- **Evidence Details:**
  - Description
  - Upload metadata
  - Case reference
  - Tag system

- **Actions:**
  - View evidence
  - Download evidence
  - Delete evidence (with confirmation)
  - Upload new evidence button

**Mock Data:**
- 8 evidence files across multiple cases
- Various file types (PDF, images, Excel)
- Different statuses and tags

---

### 6. Reports.jsx
Investigation report management and submission system.

**Features:**
- **Report Types:**
  - Final Reports
  - Progress Reports
  - Preliminary Reports

- **Report Display:**
  - Report title and description
  - Case association
  - Status badges (Approved/Under Review/Draft/Rejected)
  - Report type badges with colors
  - Page count and attachments count

- **Status Timeline:**
  - Created date
  - Submitted date
  - Approved date (if applicable)
  - Approver information

- **Stats Dashboard:**
  - Total Reports
  - Approved count
  - Under Review count
  - Draft count

- **Actions:**
  - View Report
  - Download PDF
  - Edit (for drafts)
  - Submit (for drafts)
  - Create New Report button

- **Search & Filter:**
  - Search reports by title/description
  - Filter by status

**Mock Data:**
- 5 reports with different statuses
- Various report types and stages
- Realistic approval workflows

---

### 7. Messages.jsx
Real-time communication hub with victims and team members.

**Features:**
- **Two-Panel Layout:**
  - Conversations list (left)
  - Active chat window (right)

- **Conversations List:**
  - Participant name and role
  - Case association
  - Last message preview
  - Timestamp (relative)
  - Unread message badges
  - Priority indicators

- **Chat Window:**
  - Message history with timestamps
  - Sent/received message distinction
  - Read receipts
  - Typing indicator ready
  - Real-time message updates

- **Message Input:**
  - Multi-line text input
  - File attachment button
  - Send button
  - Enter to send (Shift+Enter for new line)

- **Chat Header:**
  - Participant info
  - Case reference
  - Phone call button
  - Video call button
  - Options menu

- **Search:**
  - Search across all conversations
  - Filter by case or participant

**Mock Data:**
- 5 active conversations
- Multiple messages per conversation
- Mix of victim and team communications
- Realistic conversation flows

---

## Data Structure

### Case Object
```javascript
{
  id: number,
  title: string,
  description: string,
  crime_type: string,
  status: 'in_progress' | 'under_review' | 'resolved' | 'closed',
  priority: 'high' | 'medium' | 'low',
  assigned_date: ISO_DATE_STRING,
  deadline: ISO_DATE_STRING,
  reported_by: string (email),
  location: string,
  progress: number (0-100),
  evidence_count: number,
  updates_count: number
}
```

### Activity Object
```javascript
{
  id: number,
  type: 'case_update' | 'evidence' | 'message' | 'assignment' | 'report',
  title: string,
  description: string,
  user: string,
  timestamp: ISO_DATE_STRING,
  case_id: number,
  icon: LucideIcon,
  color: string
}
```

### Stats Object
```javascript
{
  total_assigned: number,
  in_progress: number,
  resolved: number,
  under_review: number,
  success_rate: number (percentage),
  avg_resolution_time: number (days),
  cases_this_month: number,
  pending_evidence: number
}
```

---

## Styling

**Theme:**
- Dark theme with black backgrounds
- Gradient overlays (from-gray-900 to-black)
- Gray borders (#gray-800)
- Color-coded accents for status/priority

**Animations:**
- Framer Motion for page transitions
- Staggered card animations
- Hover scale effects
- Smooth button interactions

**Responsive Design:**
- Grid layouts adapt to screen size
- Mobile-friendly navigation
- Overflow scrolling for long lists
- Touch-friendly buttons

---

## Usage

### Basic Integration
```jsx
import DashboardInvestigator from './components/Investigator/Dashboard';

// In your router or main component
<DashboardInvestigator />
```

### Individual Components
```jsx
import InvestigatorOverview from './components/Investigator/InvestigatorOverview';
import MyCases from './components/Investigator/MyCases';
import ActivityLog from './components/Investigator/ActivityLog';

// Use individually if needed
<InvestigatorOverview />
<MyCases />
<ActivityLog />
```

---

## API Integration

To connect to backend:

1. **Replace mock data** with API calls
2. **Add useEffect hooks** for data fetching
3. **Implement real-time updates** for activity log
4. **Add error handling** and loading states

### Example API Integration
```jsx
useEffect(() => {
  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/investigator/cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };
  
  fetchCases();
}, []);
```

---

## Future Enhancements

### Planned Features:
1. **Evidence Management:**
   - Upload evidence files
   - View/download evidence
   - Evidence tagging and categorization
   - Chain of custody tracking

2. **Report Generation:**
   - Case report templates
   - PDF export functionality
   - Report submission workflow
   - Progress reports

3. **Messages:**
   - Direct victim communication
   - Team collaboration chat
   - File attachments
   - Read receipts

4. **Advanced Filters:**
   - Date range filtering
   - Crime type filtering
   - Priority sorting
   - Custom views

5. **Notifications:**
   - Real-time updates
   - Deadline reminders
   - New message alerts
   - Case assignment notifications

6. **Analytics:**
   - Performance graphs
   - Case resolution trends
   - Workload distribution
   - Success rate over time

---

## Dependencies

- React 19.1.1
- Framer Motion 12.23.22
- Lucide React 0.544.0
- Tailwind CSS 4.1.14

---

## File Structure

```
Investigator/
├── Dashboard.jsx              # Main container with tab navigation
├── InvestigatorOverview.jsx   # Overview dashboard with stats
├── MyCases.jsx                # Assigned cases management
├── ActivityLog.jsx            # Activity timeline
└── README.md                  # This file
```

---

## Notes

- All components use **mock data** for demonstration
- **Dark theme** consistent across all views
- **Framer Motion** animations for smooth UX
- **Responsive** design for all screen sizes
- **Modular** structure for easy maintenance
- Ready for **API integration**
