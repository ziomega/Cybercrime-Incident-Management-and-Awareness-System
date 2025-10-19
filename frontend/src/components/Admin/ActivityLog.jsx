import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosConfig';
import { 
  Activity, Clock, FileText, Upload, MessageSquare,
  User, CheckCircle, AlertCircle, Edit, Calendar, Download
} from 'lucide-react';

// ✅ Export logs to CSV


const ActivityLog = () => {
  const [filter, setFilter] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleExport = () => {
  if (!activities.length) {
    alert("No logs to export!");
    return;
  }

  const headers = ["ID", "Type", "Title", "Description", "User", "Timestamp", "Case ID"];
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add each activity as a CSV row
  for (const activity of activities) {
    const row = [
      activity.id,
      activity.type,
      `"${activity.title}"`, // quotes to handle commas
      `"${activity.description}"`,
      activity.user,
      new Date(activity.timestamp).toLocaleString(),
      activity.case_id
    ];
    csvRows.push(row.join(","));
  }

  // Convert to a Blob and trigger download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `activity_log_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
  // ✅ Fetch logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/logs'); // Django URL
        const fetchedLogs = res.data.map(log => {
          // Map backend fields to frontend display structure
          const typeMap = {
  create: { icon: FileText, color: 'green' },
  update: { icon: Edit, color: 'yellow' },
  assign: { icon: AlertCircle, color: 'orange' },
  submit: { icon: Upload, color: 'blue' },
  delete: { icon: AlertCircle, color: 'red' },
};


          const { icon: Icon = Activity, color = 'gray' } = typeMap[log.action?.toLowerCase()] || {};

          

          return {
  id: log.id,
  type: log.action?.toLowerCase() || 'unknown',
  title: `${log.target_table} #${log.target_id}`,
  description: `${log.user} performed ${log.action} on ${log.target_table}`,
  user: log.user,
  timestamp: log.timestamp,
  case_id: log.target_id,
  icon: Icon,
  color
};

        });

        setActivities(fetchedLogs);
        console.log("Fetched logs:", fetchedLogs);

      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400 text-center">Loading logs...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity Log</h1>
          <p className="text-gray-400 mt-1">Track all your investigation activities and updates</p>
        </div>
        <motion.button
            onClick={handleExport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Log
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
  { value: 'all', label: 'All Activities', icon: Activity },
  { value: 'create', label: 'Created', icon: FileText },
  { value: 'update', label: 'Updated', icon: Edit },
  { value: 'assign', label: 'Assigned', icon: AlertCircle },
  { value: 'submit', label: 'Submitted', icon: Upload },
  { value: 'delete', label: 'Deleted', icon: AlertCircle },
]
.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

      {/* Timeline */}
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
                <div className={`p-3 bg-${activity.color}-600/20 border border-${activity.color}-600/30 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${activity.color}-400`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{activity.title}</h3>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
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
                      <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

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
