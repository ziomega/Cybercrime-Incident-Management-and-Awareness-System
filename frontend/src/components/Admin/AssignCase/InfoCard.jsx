import { Info, Shield } from 'lucide-react';

const InfoCard = ({ type, viewMode, selectedCase, formatDate }) => {
  if (type === 'selection-prompt' && !selectedCase) {
    return (
      <div className={`p-4 rounded-lg border ${
        viewMode === 'unassigned'
          ? 'bg-blue-500/10 border-blue-500/30'
          : 'bg-purple-500/10 border-purple-500/30'
      }`}>
        <div className="flex items-start gap-3">
          <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            viewMode === 'unassigned' ? 'text-blue-400' : 'text-purple-400'
          }`} />
          <div>
            <p className={`font-medium text-sm ${
              viewMode === 'unassigned' ? 'text-blue-400' : 'text-purple-400'
            }`}>
              {viewMode === 'unassigned' ? 'Select a case to assign' : 'Select a case to reassign'}
            </p>
            <p className={`text-xs mt-1 ${
              viewMode === 'unassigned' ? 'text-blue-300' : 'text-purple-300'
            }`}>
              {viewMode === 'unassigned' 
                ? 'Choose a case from the left to see recommended investigators with matching expertise'
                : 'Choose an assigned case to reassign it to a different investigator'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'current-assignment' && viewMode === 'reassign' && selectedCase?.assigned_to) {
    return (
      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-400 font-medium text-sm">Currently Assigned To</p>
            <p className="text-white font-semibold mt-1">{selectedCase.assigned_to.name}</p>
            <p className="text-purple-300 text-xs mt-0.5">{selectedCase.assigned_to.department}</p>
            <p className="text-purple-300 text-xs mt-1">
              Assigned: {formatDate(selectedCase.assigned_at)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InfoCard;
