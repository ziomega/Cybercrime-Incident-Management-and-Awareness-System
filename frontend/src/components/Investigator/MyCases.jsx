import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Eye,
  Edit,
  Upload,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

const MyCases = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned cases from API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/cases/assigned');
        setCases(response.data);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError(err.response?.data?.message || 'Failed to load cases. Please try again.');
        
        // Fallback to mock data in case of error
        setCases([
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Filter cases
  const filteredCases = cases.filter(case_item => {
    const matchesSearch = 
      case_item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_item.crime_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_item.reported_by.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      in_progress: {
        colors: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        icon: Clock,
        label: 'In Progress'
      },
      under_review: {
        colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        icon: AlertCircle,
        label: 'Under Review'
      },
      resolved: {
        colors: 'bg-green-500/10 text-green-400 border-green-500/30',
        icon: CheckCircle,
        label: 'Resolved'
      },
      closed: {
        colors: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        icon: XCircle,
        label: 'Closed'
      }
    };

    const { colors, icon: Icon, label } = config[status] || config.under_review;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const config = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${config[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Cases</h1>
          <p className="text-gray-400 mt-1">Manage and track your assigned investigations</p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && (
            <span className="text-sm text-gray-400">
              {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="w-16 h-16 text-blue-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Loading Cases...</h3>
          <p className="text-gray-500">Please wait while we fetch your assigned cases</p>
          
          {/* Skeleton Cards */}
          <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-800 rounded w-20 animate-pulse" />
                    <div className="h-6 bg-gray-800 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                  </div>
                </div>
                <div className="h-8 bg-gray-800 rounded w-32 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <div className="h-10 bg-gray-800 rounded flex-1 animate-pulse" />
                  <div className="h-10 bg-gray-800 rounded w-16 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((case_item, index) => (
          <motion.div
            key={case_item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            {/* Case Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-bold text-lg">#{index+1}</span>
                  {getPriorityBadge(case_item.priority)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{case_item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{case_item.description}</p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              {getStatusBadge(case_item.status)}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs text-gray-400 font-semibold">{case_item.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${case_item.progress}%` }}
                />
              </div>
            </div>

            {/* Case Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{case_item.crime_type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{case_item.reported_by}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{case_item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Assigned: {formatDate(case_item.assigned_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className={`${getDaysUntilDeadline(case_item.deadline) <= 3 ? 'text-red-400' : 'text-orange-400'}`}>
                  {getDaysUntilDeadline(case_item.deadline)} days until deadline
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">{case_item.evidence_count} Evidence</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">{case_item.updates_count} Updates</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No cases found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MyCases;
