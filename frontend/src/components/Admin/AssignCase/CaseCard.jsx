import { motion } from 'framer-motion';
import { FileText, User, Calendar, Shield } from 'lucide-react';

const CaseCard = ({ caseItem, isSelected, onSelect, viewMode, getPriorityBadge, formatDate }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(caseItem)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-500/20 border-blue-500'
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-lg font-bold text-blue-400">#{caseItem.id}</span>
        {getPriorityBadge(caseItem.priority)}
      </div>
      
      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
        {caseItem.description}
      </p>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <FileText className="w-3.5 h-3.5" />
          <span>{caseItem.crime_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span>{caseItem.reported_by}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(caseItem.reported_at)}</span>
        </div>
        {viewMode === 'reassign' && caseItem.assigned_to && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-400 font-medium">
              Assigned to: {caseItem.assigned_to.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CaseCard;
