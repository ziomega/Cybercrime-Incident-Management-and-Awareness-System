import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowRight, Loader, RefreshCw } from 'lucide-react';

const AssignmentActionBar = ({ 
  selectedCase, 
  selectedInvestigator, 
  viewMode,
  isAssigning,
  onAssign,
  onCancel
}) => {
  if (!selectedCase || !selectedInvestigator) return null;

  const isSameInvestigator = viewMode === 'reassign' && 
    selectedCase.assigned_to?.id === selectedInvestigator.id;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`bg-gradient-to-r from-gray-900 via-black to-gray-900 border-2 rounded-2xl shadow-2xl p-6 min-w-[500px] ${
          viewMode === 'unassigned' ? 'border-blue-500' : 'border-purple-500'
        }`}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Case</p>
                <p className={`text-xl font-bold ${viewMode === 'unassigned' ? 'text-blue-400' : 'text-purple-400'}`}>
                  #{selectedCase.id}
                </p>
                <p className="text-xs text-gray-400 mt-1">{selectedCase.crime_type}</p>
              </div>
              
              {viewMode === 'reassign' && selectedCase.assigned_to && (
                <>
                  <div className="text-center">
                    <RefreshCw className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-orange-400 font-medium">Reassigning from</p>
                    <p className="text-xs text-gray-400">{selectedCase.assigned_to.name}</p>
                  </div>
                </>
              )}
              
              <ArrowRight className="w-8 h-8 text-gray-600" />
              
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">{viewMode === 'reassign' ? 'New ' : ''}Investigator</p>
                <p className={`text-sm font-bold ${viewMode === 'unassigned' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {selectedInvestigator.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">{selectedInvestigator.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAssign}
                disabled={isAssigning || isSameInvestigator}
                className={`px-6 py-2.5 bg-gradient-to-r text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  viewMode === 'unassigned'
                    ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                }`}
              >
                {isAssigning ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {viewMode === 'reassign' ? 'Reassigning...' : 'Assigning...'}
                  </>
                ) : (
                  <>
                    {viewMode === 'reassign' ? (
                      <RefreshCw className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {viewMode === 'reassign' ? 'Reassign Case' : 'Assign Case'}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignmentActionBar;
