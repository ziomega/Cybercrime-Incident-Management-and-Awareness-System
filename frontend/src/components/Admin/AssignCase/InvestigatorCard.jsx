import { motion } from 'framer-motion';
import { Award, Shield, TrendingUp, Clock } from 'lucide-react';

const InvestigatorCard = ({ 
  investigator, 
  isSelected, 
  isRecommended, 
  isCurrent,
  hasSelectedCase,
  selectedCase,
  viewMode,
  onSelect,
  getWorkloadBadge,
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => hasSelectedCase && onSelect(investigator)}
      className={`p-4 rounded-lg border transition-all ${
        !hasSelectedCase 
          ? 'bg-gray-900/50 border-gray-800 opacity-60 cursor-not-allowed'
          : isSelected
          ? viewMode === 'unassigned'
            ? 'bg-blue-500/20 border-blue-500 cursor-pointer'
            : 'bg-purple-500/20 border-purple-500 cursor-pointer'
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 cursor-pointer'
      } ${isRecommended ? 'ring-2 ring-green-500/30' : ''} ${
        isCurrent ? 'ring-2 ring-orange-500/50 opacity-75' : ''
      }`}
    >
      {/* Status Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {isRecommended && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded">
            <Award className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400">RECOMMENDED</span>
          </div>
        )}
        {isCurrent && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-orange-400">CURRENT</span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-white">{investigator.name}</h3>
          <p className="text-xs text-gray-400">{investigator.department}</p>
        </div>
        {getWorkloadBadge(investigator.current_cases, investigator.max_capacity)}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-black/30 rounded p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-gray-400">Success</span>
          </div>
          <p className="text-sm font-bold text-white">{investigator.success_rate}%</p>
        </div>
        <div className="bg-black/30 rounded p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-gray-400">Avg Time</span>
          </div>
          <p className="text-sm font-bold text-white">{investigator.avg_resolution_time}</p>
        </div>
      </div>

      {/* Specialization Tags */}
      {selectedCase && (
        <div className="flex flex-wrap gap-1.5">
          {investigator.specialization.slice(0, 3).map((spec, idx) => {
            const matches = selectedCase.crime_type.toLowerCase().includes(spec.toLowerCase()) ||
                           spec.toLowerCase().includes(selectedCase.crime_type.toLowerCase());
            return (
              <span 
                key={idx}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  matches 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-700/30 text-gray-400'
                }`}
              >
                {spec}
              </span>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default InvestigatorCard;
