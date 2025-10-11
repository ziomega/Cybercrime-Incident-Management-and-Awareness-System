import { motion } from 'framer-motion';
import { UserPlus, RefreshCw } from 'lucide-react';

const ViewModeTabs = ({ viewMode, setViewMode, unassignedCount, assignedCount, onModeChange }) => {
  const handleModeChange = (mode) => {
    setViewMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleModeChange('unassigned')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          viewMode === 'unassigned'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-500'
            : 'bg-gray-900 text-gray-400 border-2 border-gray-800 hover:border-gray-700'
        }`}
      >
        <UserPlus className="w-5 h-5" />
        <span>Assign New Cases</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          viewMode === 'unassigned' 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-800 text-gray-500'
        }`}>
          {unassignedCount}
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleModeChange('reassign')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          viewMode === 'reassign'
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-2 border-purple-500'
            : 'bg-gray-900 text-gray-400 border-2 border-gray-800 hover:border-gray-700'
        }`}
      >
        <RefreshCw className="w-5 h-5" />
        <span>Reassign Cases</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          viewMode === 'reassign' 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-800 text-gray-500'
        }`}>
          {assignedCount}
        </span>
      </motion.button>
    </div>
  );
};

export default ViewModeTabs;
