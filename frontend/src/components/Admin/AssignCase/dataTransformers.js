/**
 * Transform unassigned case from API response to frontend format
 */
export const transformUnassignedCase = (apiCase) => {
  return {
    id: apiCase.case_id || apiCase.id,
    title: apiCase.title || '',
    description: apiCase.case_description || apiCase.description || 'No description provided',
    status: apiCase.status || 'in_progress',
    reported_at: apiCase.reported_at,
    reported_by: apiCase.reported_by || 'Unknown',
    location: apiCase.location || 'Unknown location',
    crime_type: apiCase.crime_type || 'Unknown',
    priority: apiCase.priority || 'medium'
  };
};

/**
 * Transform assigned case from API response to frontend format
 */
export const transformAssignedCase = (apiCase) => {
  return {
    id: apiCase.id,
    description: apiCase.description || 'No description provided',
    title: apiCase.title || '',
    status: apiCase.status || 'assigned',
    reported_at: apiCase.reportedDate || apiCase.reported_at,
    reported_by: apiCase.reportedBy || apiCase.reported_by || 'Unknown',
    location: apiCase.location || 'Unknown location',
    crime_type: apiCase.type || apiCase.crime_type || 'Unknown',
    priority: apiCase.priority || 'medium',
    assigned_to: apiCase.investigator ? {
      id: apiCase.investigator_id,
      name: apiCase.investigator,
      department: 'Investigation'
    } : null,
    assigned_at: apiCase.assigned_date || apiCase.assigned_at
  };
};

/**
 * Transform investigator from API response to frontend format
 */
export const transformInvestigator = (apiUser) => {
  // Generate random resolution time between 24-168 hours (1-7 days)
  const totalHours = Math.floor(Math.random() * (168 - 24 + 1)) + 24;
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const avg_resolution_time = days > 0 
    ? `${days} days ${hours} hours` 
    : `${hours} hours`;
  
  return {
    id: apiUser.id,
    name: `${apiUser.first_name || ''} ${apiUser.last_name || ''}`.trim() || apiUser.email,
    email: apiUser.email,
    department: apiUser.department || 'Investigation',
    current_cases: apiUser.cases_assigned || 0,
    max_capacity: 5, // Default capacity, can be adjusted
    success_rate: apiUser.cases_resolved && apiUser.cases_assigned 
      ? Math.round((apiUser.cases_resolved / apiUser.cases_assigned) * 100) 
      : 0,
    avg_resolution_time: avg_resolution_time,
    specialization: [] // This would need to come from backend if available
  };
};

/**
 * Calculate workload percentage for an investigator
 */
export const calculateWorkload = (currentCases, maxCapacity = 5) => {
  return Math.round((currentCases / maxCapacity) * 100);
};

/**
 * Get priority level from string
 */
export const normalizePriority = (priority) => {
  if (!priority) return 'medium';
  const normalized = priority.toLowerCase();
  if (['high', 'medium', 'low'].includes(normalized)) {
    return normalized;
  }
  return 'medium';
};

/**
 * Get status from string
 */
export const normalizeStatus = (status) => {
  if (!status) return 'in_progress';
  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  return normalized;
};
