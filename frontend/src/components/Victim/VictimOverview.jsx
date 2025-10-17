import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  FileText,
  Shield,
  Calendar,
  User,
  TrendingUp,
  MessageSquare,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function VictimOverview() {
  const { user } = useAuth();
  // Mock data
  const stats = [
    {
      title: 'Active Cases',
      value: '2',
      change: '+0',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    {
      title: 'In Progress',
      value: '1',
      change: '+1',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Resolved',
      value: '3',
      change: '+1',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Evidence Submitted',
      value: '12',
      change: '+3',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    }
  ];

  const activeCases = [
    {
      id: 'CASE-2024-001',
      type: 'Identity Theft',
      status: 'In Progress',
      priority: 'high',
      investigator: 'John Investigator',
      lastUpdate: '2 hours ago',
      progress: 65
    },
    {
      id: 'CASE-2024-003',
      type: 'Phishing Attack',
      status: 'Under Review',
      priority: 'medium',
      investigator: 'Sarah Investigator',
      lastUpdate: '1 day ago',
      progress: 40
    }
  ];

  const upcomingActivities = [
    {
      id: 1,
      title: 'Submit Additional Evidence',
      case: 'CASE-2024-001',
      dueDate: '2024-01-15',
      type: 'evidence',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Follow-up Meeting',
      case: 'CASE-2024-001',
      dueDate: '2024-01-16',
      type: 'meeting',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Review Investigation Report',
      case: 'CASE-2024-003',
      dueDate: '2024-01-18',
      type: 'review',
      priority: 'low'
    }
  ];

  const recentUpdates = [
    {
      id: 1,
      case: 'CASE-2024-001',
      message: 'New evidence has been analyzed',
      time: '2 hours ago',
      type: 'evidence'
    },
    {
      id: 2,
      case: 'CASE-2024-003',
      message: 'Case status updated to Under Review',
      time: '1 day ago',
      type: 'status'
    },
    {
      id: 3,
      case: 'CASE-2024-001',
      message: 'Investigator added new notes',
      time: '2 days ago',
      type: 'note'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Under Review': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'evidence': return FileText;
      case 'meeting': return Calendar;
      case 'review': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'evidence': return Shield;
      case 'status': return TrendingUp;
      case 'note': return FileText;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome {user.name}!</h1>
        <p className="text-gray-400">Here's an overview of your cases and activities</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const iconColorClass = stat.color.includes('orange') ? 'text-orange-400' :
                                 stat.color.includes('blue') ? 'text-blue-400' :
                                 stat.color.includes('green') ? 'text-green-400' :
                                 'text-purple-400';
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-900 border ${stat.borderColor} rounded-lg p-6 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${iconColorClass}`} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Cases */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Cases</h2>
            <span className="text-sm text-gray-400">{activeCases.length} cases</span>
          </div>

          <div className="space-y-4">
            {activeCases.map((case_) => (
              <motion.div
                key={case_.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{case_.id}</h3>
                    <p className="text-sm text-gray-400">{case_.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(case_.priority)}`}>
                    {case_.priority}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{case_.investigator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{case_.lastUpdate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full border ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                    <span className="text-gray-400">{case_.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${case_.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Upcoming Activities</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {upcomingActivities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${getPriorityColor(activity.priority)}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{activity.case}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(activity.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Updates</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentUpdates.map((update) => {
            const UpdateIcon = getUpdateIcon(update.type);
            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 bg-gray-800/30 border border-gray-800 rounded-lg"
              >
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <UpdateIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-400">{update.case}</span>
                    <span className="text-xs text-gray-500">{update.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{update.message}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      </div>
  );
}

export default VictimOverview;
