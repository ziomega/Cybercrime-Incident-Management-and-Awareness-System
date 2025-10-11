import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  FileText, 
  Upload, 
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

const ActivityLog = () => {
  const [filter, setFilter] = useState('all');

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'case_update',
      title: 'Case #12 marked as resolved',
      description: 'Identity Theft Case successfully resolved with suspect apprehended',
      user: 'You',
      timestamp: '2025-01-08T14:30:00Z',
      case_id: 12,
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'evidence',
      title: 'Evidence uploaded for Case #8',
      description: 'Screenshot of threatening messages added to evidence collection',
      user: 'You',
      timestamp: '2025-01-08T11:20:00Z',
      case_id: 8,
      icon: Upload,
      color: 'blue'
    },
    {
      id: 3,
      type: 'message',
      title: 'Message from victim - Case #5',
      description: 'Additional information provided about the fraudulent seller',
      user: 'david.brown@example.com',
      timestamp: '2025-01-08T09:15:00Z',
      case_id: 5,
      icon: MessageSquare,
      color: 'purple'
    },
    {
      id: 4,
      type: 'case_update',
      title: 'Case #5 status updated',
      description: 'Changed status from "Under Review" to "In Progress"',
      user: 'You',
      timestamp: '2025-01-07T16:45:00Z',
      case_id: 5,
      icon: Edit,
      color: 'yellow'
    },
    {
      id: 5,
      type: 'assignment',
      title: 'New case assigned',
      description: 'Cyberbullying Investigation case assigned to you',
      user: 'Admin',
      timestamp: '2025-01-07T10:00:00Z',
      case_id: 8,
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 6,
      type: 'evidence',
      title: 'Evidence uploaded for Case #1',
      description: 'Phishing email headers and source analysis document',
      user: 'You',
      timestamp: '2025-01-07T08:30:00Z',
      case_id: 1,
      icon: Upload,
      color: 'blue'
    },
    {
      id: 7,
      type: 'report',
      title: 'Investigation report submitted',
      description: 'Final report for Case #12 submitted for review',
      user: 'You',
      timestamp: '2025-01-06T15:20:00Z',
      case_id: 12,
      icon: FileText,
      color: 'indigo'
    },
    {
      id: 8,
      type: 'case_update',
      title: 'Case #1 progress updated',
      description: 'Investigation progress updated to 65%',
      user: 'You',
      timestamp: '2025-01-06T12:00:00Z',
      case_id: 1,
      icon: Activity,
      color: 'blue'
    }
  ];

  // Filter activities
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity Log</h1>
          <p className="text-gray-400 mt-1">Track all your investigation activities and updates</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Log
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All Activities', icon: Activity },
          { value: 'case_update', label: 'Case Updates', icon: Edit },
          { value: 'evidence', label: 'Evidence', icon: Upload },
          { value: 'message', label: 'Messages', icon: MessageSquare },
          { value: 'assignment', label: 'Assignments', icon: AlertCircle },
          { value: 'report', label: 'Reports', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 bg-${activity.color}-600/20 border border-${activity.color}-600/30 rounded-lg flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${activity.color}-400`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{activity.title}</h3>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                    <span className="text-blue-400 font-semibold text-sm whitespace-nowrap ml-4">
                      Case #{activity.case_id}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{activity.user}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No activities found</h3>
          <p className="text-gray-500">Try selecting a different filter</p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
