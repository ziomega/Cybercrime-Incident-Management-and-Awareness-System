import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  Target,
  Users,
  Activity,
  BarChart3,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Star,
  Zap
} from 'lucide-react';

const TeamStats = () => {
  // Mock data for investigators with their stats
  const mockInvestigators = [
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'sarah.chen@cybercrime.gov',
      department: 'Cyber Forensics',
      cases_assigned: 12,
      cases_solved: 9,
      cases_in_progress: 3,
      cases_pending: 0,
      avg_resolution_time: 4.5, // days
      success_rate: 75,
      current_workload: 'Medium',
      performance_trend: 'up',
      recent_cases: [
        { id: 2, type: 'Ransomware', status: 'in_progress', priority: 'high' },
        { id: 15, type: 'Phishing', status: 'solved', priority: 'medium' },
        { id: 23, type: 'Data Breach', status: 'solved', priority: 'high' }
      ],
      joined_date: '2023-03-20T09:00:00Z',
      last_active: '2025-01-08T15:45:00Z',
      specialization: ['Ransomware', 'Malware Analysis', 'Forensics']
    },
    {
      id: 6,
      name: 'Michael Roberts',
      email: 'michael.roberts@cybercrime.gov',
      department: 'Digital Crimes',
      cases_assigned: 15,
      cases_solved: 11,
      cases_in_progress: 4,
      cases_pending: 0,
      avg_resolution_time: 3.8,
      success_rate: 73.3,
      current_workload: 'High',
      performance_trend: 'up',
      recent_cases: [
        { id: 4, type: 'Account Takeover', status: 'in_progress', priority: 'medium' },
        { id: 18, type: 'Identity Theft', status: 'solved', priority: 'high' },
        { id: 27, type: 'Phishing', status: 'in_progress', priority: 'low' }
      ],
      joined_date: '2023-05-15T10:00:00Z',
      last_active: '2025-01-08T11:20:00Z',
      specialization: ['Identity Theft', 'Account Security', 'Social Engineering']
    },
    {
      id: 9,
      name: 'James Wilson',
      email: 'james.wilson@cybercrime.gov',
      department: 'Cyber Intelligence',
      cases_assigned: 18,
      cases_solved: 14,
      cases_in_progress: 4,
      cases_pending: 0,
      avg_resolution_time: 5.2,
      success_rate: 77.8,
      current_workload: 'High',
      performance_trend: 'stable',
      recent_cases: [
        { id: 7, type: 'Cryptocurrency Theft', status: 'in_progress', priority: 'high' },
        { id: 12, type: 'Wire Fraud', status: 'solved', priority: 'high' },
        { id: 29, type: 'Money Laundering', status: 'in_progress', priority: 'medium' }
      ],
      joined_date: '2023-07-08T08:30:00Z',
      last_active: '2025-01-08T13:00:00Z',
      specialization: ['Cryptocurrency', 'Financial Crimes', 'Blockchain Analysis']
    },
    {
      id: 11,
      name: 'Emily Parker',
      email: 'emily.parker@cybercrime.gov',
      department: 'Cyber Forensics',
      cases_assigned: 10,
      cases_solved: 7,
      cases_in_progress: 3,
      cases_pending: 0,
      avg_resolution_time: 4.1,
      success_rate: 70,
      current_workload: 'Medium',
      performance_trend: 'up',
      recent_cases: [
        { id: 10, type: 'Malware', status: 'in_progress', priority: 'high' },
        { id: 21, type: 'Data Breach', status: 'solved', priority: 'medium' },
        { id: 33, type: 'DDoS Attack', status: 'in_progress', priority: 'low' }
      ],
      joined_date: '2023-09-25T09:15:00Z',
      last_active: '2025-01-08T14:50:00Z',
      specialization: ['Malware Analysis', 'Network Security', 'Incident Response']
    },
    {
      id: 14,
      name: 'David Thompson',
      email: 'david.thompson@cybercrime.gov',
      department: 'Digital Crimes',
      cases_assigned: 8,
      cases_solved: 5,
      cases_in_progress: 2,
      cases_pending: 1,
      avg_resolution_time: 6.3,
      success_rate: 62.5,
      current_workload: 'Low',
      performance_trend: 'down',
      recent_cases: [
        { id: 35, type: 'E-commerce Fraud', status: 'in_progress', priority: 'medium' },
        { id: 38, type: 'Phishing', status: 'pending', priority: 'low' },
        { id: 42, type: 'Online Scam', status: 'in_progress', priority: 'medium' }
      ],
      joined_date: '2024-02-10T10:30:00Z',
      last_active: '2025-01-08T09:30:00Z',
      specialization: ['E-commerce Fraud', 'Consumer Protection', 'Scam Investigation']
    }
  ];

  const [investigators, setInvestigators] = useState(mockInvestigators);
  const [filteredInvestigators, setFilteredInvestigators] = useState(mockInvestigators);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cases_assigned');
  const [expandedInvestigator, setExpandedInvestigator] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter and sort investigators
  useEffect(() => {
    let filtered = investigators;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(inv => 
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'cases_assigned':
          return b.cases_assigned - a.cases_assigned;
        case 'cases_solved':
          return b.cases_solved - a.cases_solved;
        case 'success_rate':
          return b.success_rate - a.success_rate;
        case 'avg_resolution_time':
          return a.avg_resolution_time - b.avg_resolution_time;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredInvestigators(filtered);
  }, [searchQuery, sortBy, investigators]);

  // Calculate team statistics
  const teamStats = {
    total_investigators: investigators.length,
    total_cases_assigned: investigators.reduce((sum, inv) => sum + inv.cases_assigned, 0),
    total_cases_solved: investigators.reduce((sum, inv) => sum + inv.cases_solved, 0),
    total_cases_in_progress: investigators.reduce((sum, inv) => sum + inv.cases_in_progress, 0),
    avg_success_rate: investigators.reduce((sum, inv) => sum + inv.success_rate, 0) / investigators.length,
    avg_resolution_time: investigators.reduce((sum, inv) => sum + inv.avg_resolution_time, 0) / investigators.length,
    top_performer: investigators.reduce((prev, curr) => 
      curr.success_rate > prev.success_rate ? curr : prev
    ),
    high_workload: investigators.filter(inv => inv.current_workload === 'High').length
  };

  // Get workload badge
  const getWorkloadBadge = (workload) => {
    const config = {
      Low: { colors: 'bg-green-500/10 text-green-400 border-green-500/30' },
      Medium: { colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
      High: { colors: 'bg-red-500/10 text-red-400 border-red-500/30' }
    };

    const { colors } = config[workload] || config.Medium;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${colors}`}>
        {workload}
      </div>
    );
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const config = {
      high: { colors: 'bg-red-500/20 text-red-400', label: 'High' },
      medium: { colors: 'bg-yellow-500/20 text-yellow-400', label: 'Medium' },
      low: { colors: 'bg-blue-500/20 text-blue-400', label: 'Low' }
    };

    const { colors, label } = config[priority] || config.medium;

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors}`}>
        {label}
      </span>
    );
  };

  // Toggle investigator details
  const toggleExpand = (investigatorId) => {
    setExpandedInvestigator(expandedInvestigator === investigatorId ? null : investigatorId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="cases_assigned">Most Cases Assigned</option>
            <option value="cases_solved">Most Cases Solved</option>
            <option value="success_rate">Highest Success Rate</option>
            <option value="avg_resolution_time">Fastest Resolution</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Investigators List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredInvestigators.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No investigators found</p>
            </motion.div>
          ) : (
            filteredInvestigators.map((investigator, index) => {
              const isExpanded = expandedInvestigator === investigator.id;

              return (
                <motion.div
                  key={investigator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300"
                >
                  {/* Main Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 space-y-4">
                        {/* Name and Department */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-white">{investigator.name}</h2>
                              {getTrendIcon(investigator.performance_trend)}
                            </div>
                            <p className="text-gray-400 text-sm">{investigator.email}</p>
                            <p className="text-blue-400 text-sm font-medium mt-1">
                              {investigator.department}
                            </p>
                          </div>
                          {getWorkloadBadge(investigator.current_workload)}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {/* Cases Assigned */}
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-300 font-medium">ASSIGNED</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{investigator.cases_assigned}</p>
                          </div>

                          {/* Cases Solved */}
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-green-300 font-medium">SOLVED</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{investigator.cases_solved}</p>
                          </div>

                          {/* In Progress */}
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-xs text-blue-300 font-medium">IN PROGRESS</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{investigator.cases_in_progress}</p>
                          </div>

                          {/* Success Rate */}
                          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs text-cyan-300 font-medium">SUCCESS</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{investigator.success_rate}%</p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-400">Avg Resolution: </span>
                            <span className="text-white font-semibold">{investigator.avg_resolution_time} days</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Pending: </span>
                            <span className="text-yellow-400 font-semibold">{investigator.cases_pending}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleExpand(investigator.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {isExpanded ? 'Hide' : 'Details'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800"
                      >
                        <div className="p-6 bg-black/40 space-y-6">
                          {/* Recent Cases */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Activity className="w-5 h-5 text-blue-400" />
                              Recent Cases
                            </h3>
                            <div className="space-y-3">
                              {investigator.recent_cases.map((case_item, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-blue-400 font-semibold">#{case_item.id}</span>
                                    <span className="text-gray-300">{case_item.type}</span>
                                    {getPriorityBadge(case_item.priority)}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {case_item.status === 'solved' && (
                                      <CheckCircle className="w-5 h-5 text-green-400" />
                                    )}
                                    {case_item.status === 'in_progress' && (
                                      <Clock className="w-5 h-5 text-blue-400" />
                                    )}
                                    {case_item.status === 'pending' && (
                                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                    )}
                                    <span className="text-sm text-gray-400 capitalize">{case_item.status.replace('_', ' ')}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Specialization */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Specialization</h3>
                            <div className="flex flex-wrap gap-2">
                              {investigator.specialization.map((spec, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-sm font-medium"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Joined Date</label>
                              <p className="mt-1 text-gray-200">
                                {new Date(investigator.joined_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Last Active</label>
                              <p className="mt-1 text-gray-200">
                                {new Date(investigator.last_active).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeamStats;
