# Victim Dashboard Components

Complete victim/user dashboard with 4 comprehensive pages for case management and support.

## 📁 Components Overview

### 1. Dashboard.jsx
Main container component that manages tab navigation and renders active page.

**Features:**
- Tab state management
- Route rendering based on active tab
- Integrates with RoleBasedTab component
- Clean layout with proper spacing

---

### 2. VictimOverview.jsx
Landing page showing summary of victim's cases and activities.

**Features:**
- **Statistics Cards:**
  - Active Cases count
  - In Progress cases
  - Resolved cases  
  - Evidence Submitted count
  - Color-coded with gradient icons

- **Active Cases Section:**
  - Case cards with ID, type, status
  - Priority badges (high/medium/low)
  - Assigned investigator info
  - Last update timestamp
  - Progress bars (0-100%)
  - Status indicators

- **Upcoming Activities:**
  - Todo items with case association
  - Due dates and priority levels
  - Activity type icons
  - Organized timeline view

- **Recent Updates:**
  - Case activity feed
  - Update types (evidence/status/notes)
  - Timestamps and actors
  - Color-coded by type

- **Quick Actions:**
  - Message Investigator button
  - Submit Evidence button
  - Emergency Contact button
  - Gradient colored action cards

---

### 3. MyIncidents.jsx
Comprehensive incident tracking and management interface.

**Features:**
- **Stats Summary:**
  - Total incidents
  - In Progress count
  - Resolved count
  - Pending count

- **Search & Filter:**
  - Search by title, type, or ID
  - Filter by status (all/in-progress/under-review/resolved/pending)
  - Real-time filtering

- **Incident Cards:**
  - Full incident details (title, description, type)
  - Status and priority badges
  - Case ID association
  - Investigator assignment
  - Evidence count
  - Location information
  - Progress percentage
  - Report date and last update

- **Actions:**
  - View Details (opens modal)
  - Message Investigator
  - "Report New Incident" button

- **Incident Detail Modal:**
  - Complete incident information
  - Timeline of events
  - Event type icons
  - Date tracking

**Mock Data:**
- 5 sample incidents
- Various statuses and priorities
- Different incident types
- Realistic timelines

---

### 4. CaseStatus.jsx
Detailed case progress tracking with comprehensive timeline.

**Features:**
- **Case Selector:**
  - Dropdown to switch between cases
  - Shows case ID and title

- **Case Overview Card:**
  - Full case title and type
  - Status badge
  - Overall progress percentage
  - Gradient progress bar
  - Current investigation stage

- **Key Metrics Grid:**
  - Days Open
  - Evidence Items collected
  - Documents generated
  - Last Activity timestamp

- **Investigation Timeline:**
  - 6-stage progress tracker:
    1. Incident Reported
    2. Case Assigned
    3. Evidence Collection
    4. Evidence Analysis
    5. Investigation Report
    6. Case Resolution
  - Visual timeline with colored indicators
  - Status-based coloring (completed/in-progress/pending)
  - Descriptions for each stage
  - Actual dates for completed stages

- **Investigator Information:**
  - Avatar and name
  - Contact details (email, phone)
  - "Send Message" button

- **Important Dates:**
  - Reported date
  - Estimated completion
  - Days remaining countdown
  - Color-coded alerts

- **Evidence Files:**
  - File list with names, types, sizes
  - Upload dates
  - Status badges (verified/under-review)
  - View and Download buttons

- **Case Documents:**
  - Generated documents list
  - Document types (reports, logs, analysis)
  - View and Download actions

- **Recent Updates Feed:**
  - Activity timeline
  - Update types with icons
  - Timestamps and actors
  - Detailed messages

**Mock Data:**
- 2 detailed cases
- Complete investigation stages
- Evidence and documents
- Update history

---

### 5. Resources.jsx
Comprehensive resource library and support information.

**Features:**
- **Emergency Contacts Banner:**
  - 3 helplines displayed prominently
  - Phone numbers and hours
  - Service descriptions
  - Red/orange theme for urgency

- **Featured Resources:**
  - 3 highlighted resources
  - Icon-based cards
  - Download counts
  - Quick preview access

- **Category Filter:**
  - 6 categories:
    - All Resources
    - Safety Guides
    - Legal Information
    - Support Services
    - FAQs
    - Educational Videos
  - Icon-based tabs
  - Active state highlighting

- **Search Functionality:**
  - Search by title, description, or topics
  - Real-time filtering
  - Keyword matching

- **Resource Cards:**
  - Title and description
  - Resource type (PDF/Video/Document)
  - File size and page count
  - Topic tags
  - Download count
  - Last updated date
  - Preview and Download buttons

- **Resource Preview Modal:**
  - Full resource details
  - Complete topic list
  - File information
  - Download statistics
  - Primary download button

- **External Links Section:**
  - Links to trusted organizations
  - Opens in new tab
  - Brief descriptions
  - Hover effects

**Mock Data:**
- 8 comprehensive resources
- Multiple categories
- Emergency contacts
- External resources

---

## 🎨 Design Features

### Consistent Dark Theme
- Black and gray gradients
- Blue accent colors
- Gray borders and separators

### Animations
- Framer Motion transitions
- Staggered card appearances
- Hover effects
- Scale transformations
- Modal animations

### Responsive Layout
- Grid-based layouts
- Mobile-friendly
- Flexbox arrangements
- Overflow handling

### Color Coding
- **Status Colors:**
  - Blue: In Progress
  - Yellow: Under Review
  - Green: Resolved/Completed
  - Gray: Pending
  
- **Priority Colors:**
  - Red: High
  - Yellow: Medium
  - Green: Low

### Icons
- Lucide React icons throughout
- Context-appropriate icons
- Consistent sizing

---

## 📊 Mock Data Structure

### Case Object
```javascript
{
  id: 'CASE-2024-001',
  title: 'Identity Theft via Social Media',
  type: 'Identity Theft',
  status: 'In Progress',
  priority: 'high',
  investigator: { name, email, phone, avatar },
  reportedDate: '2024-01-05',
  progress: 65,
  stages: [...],
  updates: [...],
  evidence: [...],
  documents: [...]
}
```

### Incident Object
```javascript
{
  id: 'INC-2024-001',
  caseId: 'CASE-2024-001',
  title: 'Identity Theft via Social Media',
  type: 'Identity Theft',
  status: 'In Progress',
  priority: 'high',
  description: '...',
  location: 'Online - Facebook',
  evidenceCount: 8,
  timeline: [...]
}
```

### Resource Object
```javascript
{
  id: 1,
  title: 'Complete Guide to Identity Theft Protection',
  category: 'guides',
  type: 'PDF Guide',
  size: '2.4 MB',
  pages: 24,
  description: '...',
  topics: [...],
  downloadCount: 1247,
  featured: true
}
```

---

## 🔌 Integration Notes

### Backend API Endpoints (Ready for Integration)

**Overview:**
- GET `/api/victim/stats` - Dashboard statistics
- GET `/api/victim/cases/active` - Active cases
- GET `/api/victim/activities` - Upcoming activities
- GET `/api/victim/updates` - Recent updates

**Incidents:**
- GET `/api/victim/incidents` - All incidents
- POST `/api/victim/incidents` - Report new incident
- GET `/api/victim/incidents/:id` - Incident details

**Case Status:**
- GET `/api/victim/cases` - All cases
- GET `/api/victim/cases/:id` - Case details
- GET `/api/victim/cases/:id/timeline` - Case timeline
- GET `/api/victim/cases/:id/evidence` - Case evidence
- GET `/api/victim/cases/:id/documents` - Case documents

**Resources:**
- GET `/api/resources` - All resources
- GET `/api/resources/featured` - Featured resources
- GET `/api/resources/:id/download` - Download resource
- GET `/api/emergency-contacts` - Emergency contacts

---

## 🚀 Usage

```jsx
import DashboardUser from './components/Victim/Dashboard';

// In your routes
<Route path="/victim-dashboard" element={<DashboardUser />} />
```

---

## ✅ Features Checklist

- ✅ Overview dashboard with stats
- ✅ Active cases display
- ✅ Incident management
- ✅ Case progress tracking
- ✅ Investigation timeline
- ✅ Evidence tracking
- ✅ Document access
- ✅ Resource library
- ✅ Emergency contacts
- ✅ Search and filter
- ✅ Investigator communication
- ✅ Mobile responsive
- ✅ Dark theme
- ✅ Smooth animations
- ✅ Modal previews

---

## 🎯 Next Steps

1. **Backend Integration:**
   - Replace mock data with API calls
   - Add loading states
   - Implement error handling

2. **Real-time Updates:**
   - WebSocket for live notifications
   - Auto-refresh case status
   - Real-time message indicators

3. **Enhanced Features:**
   - File upload for evidence
   - Document annotations
   - Resource bookmarking
   - Notification system

4. **Testing:**
   - Unit tests for components
   - Integration tests
   - E2E testing

---

## 📝 Notes

- All components use mock data for immediate testing
- Ready for API integration
- Fully responsive design
- Accessible and user-friendly
- Consistent with investigator dashboard design
