import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Award,
  Calendar,
  Target
} from 'lucide-react';

const InvestigatorOverview = () => {
  // Mock stats data
  const stats = {
    total_assigned: 8,
    in_progress: 3,
    resolved: 4,
    under_review: 1,
    success_rate: 88.5,
    avg_resolution_time: 4.2,
    cases_this_month: 5,
    pending_evidence: 7
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Case #12 marked as resolved',
      timestamp: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      action: 'New evidence uploaded for Case #8',
      timestamp: '5 hours ago',
      type: 'info'
    },
    {
      id: 3,
      action: 'Case #5 status updated to In Progress',
      timestamp: '1 day ago',
      type: 'info'
    },
    {
      id: 4,
      action: 'New case #16 assigned',
      timestamp: '2 days ago',
      type: 'warning'
    }
  ];

  const upcomingDeadlines = [
    {
      case_id: 1,
      title: 'Phishing Attack Investigation',
      deadline: '2025-01-15',
      priority: 'high',
      days_left: 7
    },
    {
      case_id: 5,
      title: 'E-commerce Fraud Case',
      deadline: '2025-01-14',
      priority: 'medium',
      days_left: 6
    },
    {
      case_id: 8,
      title: 'Cyberbullying Investigation',
      deadline: '2025-01-16',
      priority: 'high',
      days_left: 8
    }
  ];

  const statCards = [
    {
      title: 'Total Cases',
      value: stats.total_assigned,
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: Clock,
      color: 'yellow',
      gradient: 'from-yellow-600 to-yellow-700'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'green',
      gradient: 'from-green-600 to-green-700'
    },
    {
      title: 'Success Rate',
      value: `${stats.success_rate}%`,
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Investigator Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your case overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
          <Award className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">Senior Investigator</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Resolution Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Avg Resolution Time</h3>
              <p className="text-gray-400 text-sm">Days per case</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{stats.avg_resolution_time}</span>
            <span className="text-gray-400 text-lg mb-1">days</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">15% faster than average</span>
          </div>
        </motion.div>

        {/* Cases This Month */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cases This Month</h3>
              <p className="text-gray-400 text-sm">January 2025</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{stats.cases_this_month}</span>
            <span className="text-gray-400 text-lg mb-1">cases</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">On track with monthly goals</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.case_id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 font-bold">#{deadline.case_id}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        deadline.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        deadline.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {deadline.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium">{deadline.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-400 text-xs">{deadline.deadline}</span>
                  <span className={`text-xs font-semibold ${
                    deadline.days_left <= 3 ? 'text-red-400' :
                    deadline.days_left <= 7 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {deadline.days_left} days left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestigatorOverview;
