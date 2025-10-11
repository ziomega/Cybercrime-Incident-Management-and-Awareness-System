import { AlertCircle, Clock, Info } from 'lucide-react';

// Get priority badge configuration
export const getPriorityBadge = (priority) => {
  const config = {
    high: { 
      colors: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: AlertCircle,
      label: 'High Priority'
    },
    medium: { 
      colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      icon: Clock,
      label: 'Medium Priority'
    },
    low: { 
      colors: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: Info,
      label: 'Low Priority'
    }
  };

  const { colors, icon: Icon, label } = config[priority] || config.medium;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

// Get workload badge configuration
export const getWorkloadBadge = (currentCases, maxCapacity) => {
  const percentage = (currentCases / maxCapacity) * 100;
  
  let colors, label;
  if (percentage < 60) {
    colors = 'bg-green-500/10 text-green-400 border-green-500/30';
    label = 'Available';
  } else if (percentage < 80) {
    colors = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    label = 'Moderate';
  } else {
    colors = 'bg-red-500/10 text-red-400 border-red-500/30';
    label = 'Busy';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-medium ${colors}`}>
      <span>{currentCases}/{maxCapacity}</span>
      <span>•</span>
      <span>{label}</span>
    </div>
  );
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get recommended investigators
export const getRecommendedInvestigators = (filteredInvestigators, selectedCase) => {
  if (!selectedCase) return [];
  
  return filteredInvestigators
    .map(inv => {
      let score = 0;
      
      // Check specialization match
      const hasSpecialization = inv.specialization.some(spec => 
        selectedCase.crime_type.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(selectedCase.crime_type.toLowerCase())
      );
      
      if (hasSpecialization) score += 50;
      
      // Check workload
      const workloadPercentage = (inv.current_cases / inv.max_capacity) * 100;
      if (workloadPercentage < 60) score += 30;
      else if (workloadPercentage < 80) score += 20;
      else score += 10;
      
      // Check success rate
      if (inv.success_rate > 75) score += 20;
      else if (inv.success_rate > 65) score += 10;
      
      return { ...inv, recommendationScore: score, hasSpecialization };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};
