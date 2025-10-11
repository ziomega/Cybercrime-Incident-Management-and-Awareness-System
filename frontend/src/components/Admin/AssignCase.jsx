import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import ViewModeTabs from './AssignCase/ViewModeTabs';
import CaseCard from './AssignCase/CaseCard';
import InvestigatorCard from './AssignCase/InvestigatorCard';
import SearchAndFilter from './AssignCase/SearchAndFilter';
import AssignmentActionBar from './AssignCase/AssignmentActionBar';
import SuccessMessage from './AssignCase/SuccessMessage';
import InfoCard from './AssignCase/InfoCard';
import { 
  mockUnassignedCases, 
  mockAssignedCases, 
  mockInvestigators 
} from './AssignCase/mockData';
import { 
  getPriorityBadge, 
  getWorkloadBadge, 
  formatDate, 
  getRecommendedInvestigators 
} from './AssignCase/utils.jsx';

const AssignCase = () => {
  // View mode state
  const [viewMode, setViewMode] = useState('unassigned'); // 'unassigned' or 'reassign'
  
  // State management
  const [unassignedCases, setUnassignedCases] = useState(mockUnassignedCases);
  const [assignedCases, setAssignedCases] = useState(mockAssignedCases);
  const [investigators, setInvestigators] = useState(mockInvestigators);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedInvestigator, setSelectedInvestigator] = useState(null);
  const [searchCaseQuery, setSearchCaseQuery] = useState('');
  const [searchInvestigatorQuery, setSearchInvestigatorQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [loading] = useState(false);

  // Handler for view mode change
  const handleViewModeChange = () => {
    setSelectedCase(null);
    setSelectedInvestigator(null);
    setSearchCaseQuery('');
    setPriorityFilter('all');
  };

  // Filter cases based on view mode
  const casesToShow = viewMode === 'unassigned' ? unassignedCases : assignedCases;
  
  const filteredCases = casesToShow.filter(case_item => {
    const matchesSearch = 
      case_item.id.toString().includes(searchCaseQuery) ||
      case_item.description.toLowerCase().includes(searchCaseQuery.toLowerCase()) ||
      case_item.crime_type.toLowerCase().includes(searchCaseQuery.toLowerCase()) ||
      (case_item.assigned_to?.name.toLowerCase().includes(searchCaseQuery.toLowerCase()) || false);
    
    const matchesPriority = priorityFilter === 'all' || case_item.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // Filter investigators
  const filteredInvestigators = investigators.filter(inv => {
    const matchesSearch = 
      inv.name.toLowerCase().includes(searchInvestigatorQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchInvestigatorQuery.toLowerCase()) ||
      inv.department.toLowerCase().includes(searchInvestigatorQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Get recommended investigators for selected case
  const recommendedInvestigators = getRecommendedInvestigators(filteredInvestigators, selectedCase);

  // Handle case assignment
  const handleAssignment = async () => {
    if (!selectedCase || !selectedInvestigator) return;
    
    setIsAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      if (viewMode === 'unassigned') {
        // Remove assigned case from unassigned list
        setUnassignedCases(prev => prev.filter(c => c.id !== selectedCase.id));
        
        // Add to assigned cases
        const newAssignedCase = {
          ...selectedCase,
          status: 'assigned',
          assigned_to: {
            id: selectedInvestigator.id,
            name: selectedInvestigator.name,
            department: selectedInvestigator.department
          },
          assigned_at: new Date().toISOString()
        };
        setAssignedCases(prev => [...prev, newAssignedCase]);
      } else {
        // Reassignment: Update the assigned investigator
        setAssignedCases(prev => prev.map(c => 
          c.id === selectedCase.id 
            ? {
                ...c,
                assigned_to: {
                  id: selectedInvestigator.id,
                  name: selectedInvestigator.name,
                  department: selectedInvestigator.department
                },
                assigned_at: new Date().toISOString()
              }
            : c
        ));
        
        // Update old investigator's case count (decrease)
        if (selectedCase.assigned_to) {
          setInvestigators(prev => prev.map(inv => 
            inv.id === selectedCase.assigned_to.id 
              ? { ...inv, current_cases: Math.max(0, inv.current_cases - 1) }
              : inv
          ));
        }
      }
      
      // Update new investigator's case count (increase)
      setInvestigators(prev => prev.map(inv => 
        inv.id === selectedInvestigator.id 
          ? { ...inv, current_cases: inv.current_cases + 1 }
          : inv
      ));
      
      setIsAssigning(false);
      setAssignmentSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setAssignmentSuccess(false);
        setSelectedCase(null);
        setSelectedInvestigator(null);
      }, 2000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with View Mode Tabs */}
      <div className="space-y-4">
        <ViewModeTabs
          viewMode={viewMode}
          setViewMode={setViewMode}
          unassignedCount={unassignedCases.length}
          assignedCount={assignedCases.length}
          onModeChange={handleViewModeChange}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {viewMode === 'unassigned' ? 'Unassigned Cases' : 'Assigned Cases'}
            </h2>
            <span className="text-sm text-gray-400">{filteredCases.length} cases</span>
          </div>

          {/* Search and Filter */}
          <SearchAndFilter
            searchValue={searchCaseQuery}
            onSearchChange={setSearchCaseQuery}
            filterValue={priorityFilter}
            onFilterChange={setPriorityFilter}
            searchPlaceholder={viewMode === 'unassigned' ? 'Search cases...' : 'Search cases or investigator...'}
          />

          {/* Cases List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400">All cases have been assigned!</p>
              </div>
            ) : (
              filteredCases.map((case_item) => (
                <CaseCard
                  key={case_item.id}
                  caseItem={case_item}
                  isSelected={selectedCase?.id === case_item.id}
                  onSelect={setSelectedCase}
                  viewMode={viewMode}
                  getPriorityBadge={getPriorityBadge}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column - Investigators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {selectedCase ? 'Recommended Investigators' : 'Available Investigators'}
            </h2>
            <span className="text-sm text-gray-400">{filteredInvestigators.length} investigators</span>
          </div>

          {/* Search */}
          <SearchAndFilter
            searchValue={searchInvestigatorQuery}
            onSearchChange={setSearchInvestigatorQuery}
            filterValue="all"
            onFilterChange={() => {}}
            searchPlaceholder="Search investigators..."
            showFilter={false}
          />

          {/* Info Cards */}
          <InfoCard
            type="selection-prompt"
            viewMode={viewMode}
            selectedCase={selectedCase}
            formatDate={formatDate}
          />

          <InfoCard
            type="current-assignment"
            viewMode={viewMode}
            selectedCase={selectedCase}
            formatDate={formatDate}
          />

          {/* Investigators List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {(selectedCase ? recommendedInvestigators : filteredInvestigators).map((investigator, index) => {
              const isRecommended = selectedCase && investigator.hasSpecialization;
              const isCurrent = viewMode === 'reassign' && selectedCase?.assigned_to?.id === investigator.id;
              
              return (
                <InvestigatorCard
                  key={investigator.id}
                  investigator={investigator}
                  isSelected={selectedInvestigator?.id === investigator.id}
                  isRecommended={isRecommended}
                  isCurrent={isCurrent}
                  hasSelectedCase={!!selectedCase}
                  selectedCase={selectedCase}
                  viewMode={viewMode}
                  onSelect={setSelectedInvestigator}
                  getWorkloadBadge={getWorkloadBadge}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Assignment Action Bar */}
      <AssignmentActionBar
        selectedCase={selectedCase}
        selectedInvestigator={selectedInvestigator}
        viewMode={viewMode}
        isAssigning={isAssigning}
        onAssign={handleAssignment}
        onCancel={() => {
          setSelectedCase(null);
          setSelectedInvestigator(null);
        }}
      />

      {/* Success Message */}
      <SuccessMessage
        show={assignmentSuccess}
        viewMode={viewMode}
        caseId={selectedCase?.id}
        investigatorName={selectedInvestigator?.name}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default AssignCase;
