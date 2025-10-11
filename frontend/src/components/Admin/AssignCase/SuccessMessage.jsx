import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = ({ show, viewMode, caseId, investigatorName }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 border-2 border-green-500 rounded-2xl shadow-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {viewMode === 'reassign' ? 'Case Reassigned Successfully!' : 'Case Assigned Successfully!'}
            </h3>
            <p className="text-green-300">
              Case #{caseId} has been {viewMode === 'reassign' ? 'reassigned' : 'assigned'} to {investigatorName}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessMessage;
