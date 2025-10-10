import { AlertTriangle, CheckCircle, Clock, TrendingUp, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const IncidentCards = ({ stats }) => {
  // Default stats if not provided
  const defaultStats = {
    total: 0,
    critical: 0,
    solved: 0,
    pending: 0,
    inProgress: 0,
    rejected: 0,
  };

  const incidentStats = stats || defaultStats;

  const cards = [
    {
      title: 'Total Incidents',
      value: incidentStats.total,
      icon: TrendingUp,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Critical',
      value: incidentStats.critical,
      icon: AlertTriangle,
      color: 'red',
      bgGradient: 'from-red-500/20 to-red-600/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30',
    },
    {
      title: 'Solved',
      value: incidentStats.solved,
      icon: CheckCircle,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Pending',
      value: incidentStats.pending,
      icon: Clock,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'In Progress',
      value: incidentStats.inProgress,
      icon: AlertCircle,
      color: 'orange',
      bgGradient: 'from-orange-500/20 to-orange-600/20',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
    },
    {
      title: 'Rejected',
      value: incidentStats.rejected,
      icon: XCircle,
      color: 'gray',
      bgGradient: 'from-gray-500/20 to-gray-600/20',
      iconBg: 'bg-gray-500/20',
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-500/30',
    },
  ];

  return (
    <div className="w-full my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`
              relative overflow-hidden rounded-lg border ${card.borderColor}
              bg-gradient-to-br ${card.bgGradient}
              backdrop-blur-sm p-5
              shadow-lg hover:shadow-xl
              transition-all duration-300
              min-w-[240px]
            `}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-400 mb-1.5">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {card.value.toLocaleString()}
                  </h3>
                </div>
                <div className={`
                  ${card.iconBg} ${card.iconColor}
                  p-2.5 rounded-lg
                  shadow-lg flex-shrink-0
                `}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              
              {/* Optional: Progress bar or additional info */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((card.value / incidentStats.total) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${card.bgGradient.replace('/20', '')}`}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {incidentStats.total > 0 
                    ? `${Math.round((card.value / incidentStats.total) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default IncidentCards;
