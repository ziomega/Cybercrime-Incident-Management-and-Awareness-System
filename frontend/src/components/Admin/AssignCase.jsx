import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ViewModeTabs from './AssignCase/ViewModeTabs';
import CaseCard from './AssignCase/CaseCard';
import InvestigatorCard from './AssignCase/InvestigatorCard';
import SearchAndFilter from './AssignCase/SearchAndFilter';
import AssignmentActionBar from './AssignCase/AssignmentActionBar';
import SuccessMessage from './AssignCase/SuccessMessage';
import InfoCard from './AssignCase/InfoCard';
import PriorityChangeModal from './AssignCase/PriorityChangeModal';
import { 
  getUnassignedCases,
  getAssignedCases,
  getInvestigators,
  assignCase as assignCaseAPI,
  reassignCase as reassignCaseAPI,
  updateCasePriority
} from '../../api/assignCaseService';
import {
  transformUnassignedCase,
  transformAssignedCase,
  transformInvestigator
} from './AssignCase/dataTransformers';
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
  const [unassignedCases, setUnassignedCases] = useState([]);
  const [assignedCases, setAssignedCases] = useState([]);
  const [investigators, setInvestigators] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedInvestigator, setSelectedInvestigator] = useState(null);
  const [searchCaseQuery, setSearchCaseQuery] = useState('');
  const [searchInvestigatorQuery, setSearchInvestigatorQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [caseToEditPriority, setCaseToEditPriority] = useState(null);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  // Fetch data on component mount and when view mode changes
  useEffect(() => {
    fetchData();
  }, [viewMode]);

  // Fetch all required data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch investigators (needed for both modes)
      const investigatorsData = await getInvestigators();
      const transformedInvestigators = investigatorsData.map(transformInvestigator);
      setInvestigators(transformedInvestigators);

      // Fetch cases based on view mode
      if (viewMode === 'unassigned') {
        const unassignedData = await getUnassignedCases();
        const transformedUnassigned = unassignedData.map(transformUnassignedCase);
        setUnassignedCases(transformedUnassigned);
      } else {
        const assignedData = await getAssignedCases();
        const transformedAssigned = assignedData.map(transformAssignedCase);
        setAssignedCases(transformedAssigned);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      (case_item.title?.toLowerCase().includes(searchCaseQuery.toLowerCase()) || false) ||
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

  // Handle opening priority edit modal
  const handlePriorityEdit = (caseItem) => {
    setCaseToEditPriority(caseItem);
    setPriorityModalOpen(true);
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority) => {
    if (!caseToEditPriority || caseToEditPriority.priority === newPriority) return;
    
    setIsUpdatingPriority(true);
    setError(null);
    
    try {
      await updateCasePriority(caseToEditPriority.id, newPriority);
      
      // Update local state
      if (viewMode === 'unassigned') {
        setUnassignedCases(prev => prev.map(c => 
          c.id === caseToEditPriority.id 
            ? { ...c, priority: newPriority }
            : c
        ));
      } else {
        setAssignedCases(prev => prev.map(c => 
          c.id === caseToEditPriority.id 
            ? { ...c, priority: newPriority }
            : c
        ));
      }
      
      // Update the case to edit priority state
      setCaseToEditPriority(prev => ({ ...prev, priority: newPriority }));
      
      setIsUpdatingPriority(false);
      
      // Close modal after short delay
      setTimeout(() => {
        setPriorityModalOpen(false);
        setCaseToEditPriority(null);
      }, 500);
    } catch (err) {
      console.error('Error updating priority:', err);
      setError(err.response?.data?.error || 'Failed to update priority. Please try again.');
      setIsUpdatingPriority(false);
    }
  };

  // Handle case assignment
  const handleAssignment = async () => {
    if (!selectedCase || !selectedInvestigator) return;
    
    setIsAssigning(true);
    setError(null);
    
    try {
      if (viewMode === 'unassigned') {
        // Assign the case
        await assignCaseAPI(selectedCase.id, selectedInvestigator.id);
        
        // Update local state
        setUnassignedCases(prev => prev.filter(c => c.id !== selectedCase.id));
        
        // Optionally refresh assigned cases for accurate count
        // Or add to assigned cases locally
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
        // Reassign the case
        await reassignCaseAPI(selectedCase.id, selectedInvestigator.id);
        
        // Update local state
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
    } catch (err) {
      console.error('Error during assignment:', err);
      setError(err.response?.data?.error || 'Failed to assign case. Please try again.');
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error Loading Data</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            <button
              onClick={fetchData}
              className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
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
        {/* Error Alert (shown during assignment errors) */}
        {error && !loading && (
          <div className="lg:col-span-2">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-medium">Assignment Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
            searchPlaceholder={viewMode === 'unassigned' ? 'Search by ID, title, description, crime type...' : 'Search by ID, title, description, investigator...'}
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
                  onPriorityEdit={handlePriorityEdit}
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

      {/* Priority Change Modal */}
      <PriorityChangeModal
        isOpen={priorityModalOpen}
        onClose={() => {
          setPriorityModalOpen(false);
          setCaseToEditPriority(null);
        }}
        caseItem={caseToEditPriority}
        currentPriority={caseToEditPriority?.priority}
        onPriorityChange={handlePriorityChange}
        isUpdating={isUpdatingPriority}
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
