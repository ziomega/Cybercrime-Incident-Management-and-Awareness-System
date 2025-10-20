import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle } from 'lucide-react';

const PriorityChangeModal = ({ 
  isOpen, 
  onClose, 
  caseItem, 
  currentPriority, 
  onPriorityChange,
  isUpdating 
}) => {
  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'green', icon: '🟢' },
    { value: 'medium', label: 'Medium Priority', color: 'yellow', icon: '🟡' },
    { value: 'high', label: 'High Priority', color: 'red', icon: '🔴' }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Change Priority</h3>
                    <p className="text-sm text-gray-400">Case #{caseItem?.id}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Case Info */}
              {caseItem?.title && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300 font-medium">{caseItem.title}</p>
                </div>
              )}

              {/* Priority Options */}
              <div className="space-y-3 mb-6">
                <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Select New Priority
                </label>
                {priorities.map((priority) => (
                  <motion.button
                    key={priority.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPriorityChange(priority.value)}
                    disabled={isUpdating || currentPriority === priority.value}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      currentPriority === priority.value
                        ? `${getPriorityColor(priority.value)} border-opacity-100`
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    } ${
                      isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{priority.icon}</span>
                        <div className="text-left">
                          <p className="text-white font-medium">{priority.label}</p>
                          {currentPriority === priority.value && (
                            <p className="text-xs text-gray-400">Current priority</p>
                          )}
                        </div>
                      </div>
                      {currentPriority === priority.value && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Loading State */}
              {isUpdating && (
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                  <span className="text-sm">Updating priority...</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PriorityChangeModal;
