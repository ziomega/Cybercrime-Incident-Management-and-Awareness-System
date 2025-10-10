import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  User, 
  MapPin, 
  FileText,
  Calendar,
  Eye,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';

const AllIncidents = () => {
  // Mock data for incidents
  const mockIncidents = [
    {
      id: 1,
      user: 'john.doe@example.com',
      description: 'Phishing email received claiming to be from bank. Email contains suspicious links requesting personal information and account credentials.',
      status: 'in_progress',
      reported_at: '2025-01-08T10:30:00Z',
      location: '123 Main St, New York, NY 10001',
      crime_type: 'Phishing'
    },
    {
      id: 2,
      user: 'sarah.wilson@example.com',
      description: 'Ransomware attack on company servers. All files have been encrypted and a ransom note demanding payment in cryptocurrency has been left.',
      status: 'assigned',
      reported_at: '2025-01-07T14:20:00Z',
      location: '456 Business Ave, Los Angeles, CA 90012',
      crime_type: 'Ransomware'
    },
    {
      id: 3,
      user: 'mike.johnson@example.com',
      description: 'Identity theft - unauthorized credit card transactions detected. Multiple purchases made in different states within hours.',
      status: 'resolved',
      reported_at: '2025-01-05T09:15:00Z',
      location: '789 Oak Drive, Chicago, IL 60601',
      crime_type: 'Identity Theft'
    },
    {
      id: 4,
      user: 'emma.davis@example.com',
      description: 'Social media account hacked. Unauthorized posts and messages sent to contacts asking for money transfers.',
      status: 'assigned',
      reported_at: '2025-01-06T16:45:00Z',
      location: '321 Pine Street, Houston, TX 77001',
      crime_type: 'Account Takeover'
    },
    {
      id: 5,
      user: 'david.brown@example.com',
      description: 'Online shopping fraud - paid for items that never arrived. Seller has disappeared and website is now offline.',
      status: 'in_progress',
      reported_at: '2025-01-08T11:30:00Z',
      location: '654 Elm Road, Phoenix, AZ 85001',
      crime_type: 'E-commerce Fraud'
    },
    {
      id: 6,
      user: 'lisa.anderson@example.com',
      description: 'Data breach detected in company database. Personal information of customers may have been compromised including names, addresses, and payment details.',
      status: 'resolved',
      reported_at: '2025-01-03T08:00:00Z',
      location: '987 Tech Park, San Francisco, CA 94102',
      crime_type: 'Data Breach'
    },
    {
      id: 7,
      user: 'robert.taylor@example.com',
      description: 'Cryptocurrency wallet hacked. All digital assets transferred to unknown wallet address.',
      status: 'assigned',
      reported_at: '2025-01-07T13:20:00Z',
      location: '147 Crypto Lane, Miami, FL 33101',
      crime_type: 'Cryptocurrency Theft'
    },
    {
      id: 8,
      user: 'jennifer.white@example.com',
      description: 'Cyberbullying and harassment through multiple social media platforms. Threatening messages and personal information shared publicly.',
      status: 'in_progress',
      reported_at: '2025-01-08T15:00:00Z',
      location: '258 Valley View, Seattle, WA 98101',
      crime_type: 'Cyberbullying'
    },
    {
      id: 9,
      user: 'james.martinez@example.com',
      description: 'Business email compromise - CEO impersonation. Fraudulent email requesting urgent wire transfer to fake vendor account.',
      status: 'resolved',
      reported_at: '2025-01-04T10:45:00Z',
      location: '369 Corporate Blvd, Boston, MA 02101',
      crime_type: 'BEC Attack'
    },
    {
      id: 10,
      user: 'patricia.garcia@example.com',
      description: 'Malware infection on company network. Multiple computers showing unusual behavior and data exfiltration suspected.',
      status: 'assigned',
      reported_at: '2025-01-06T12:30:00Z',
      location: '741 Industrial Way, Denver, CO 80201',
      crime_type: 'Malware'
    }
  ];

  // Mock assignment data
  const mockAssignments = {
    2: {
      assigned_to: 'Detective Sarah Chen',
      assigned_at: '2025-01-07T15:00:00Z'
    },
    4: {
      assigned_to: 'Agent Michael Roberts',
      assigned_at: '2025-01-06T17:30:00Z'
    },
    7: {
      assigned_to: 'Inspector James Wilson',
      assigned_at: '2025-01-07T14:00:00Z'
    },
    10: {
      assigned_to: 'Detective Emily Parker',
      assigned_at: '2025-01-06T13:00:00Z'
    }
  };

  const [incidents, setIncidents] = useState(mockIncidents);
  const [filteredIncidents, setFilteredIncidents] = useState(mockIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [expandedIncident, setExpandedIncident] = useState(null);
  const [assignments, setAssignments] = useState(mockAssignments);

  // Filter incidents based on search and status
  useEffect(() => {
    let filtered = incidents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(incident => 
        incident.id.toString().includes(searchQuery) ||
        incident.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.crime_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    setFilteredIncidents(filtered);
  }, [searchQuery, statusFilter, incidents]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: {
        icon: Clock,
        label: 'In Progress',
        colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      },
      assigned: {
        icon: UserCheck,
        label: 'Assigned',
        colors: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      },
      resolved: {
        icon: CheckCircle,
        label: 'Resolved',
        colors: 'bg-green-500/10 text-green-400 border-green-500/30'
      }
    };

    const config = statusConfig[status] || {
      icon: AlertCircle,
      label: status,
      colors: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    };

    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.colors}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Toggle incident details
  const toggleExpand = (incidentId) => {
    setExpandedIncident(expandedIncident === incidentId ? null : incidentId);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">All Incidents</h1>
            <p className="text-gray-400 mt-1">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, description, user, crime type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>
      {/* Summary Header */}
      {filteredIncidents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">
                In Progress: <span className="text-yellow-400 font-semibold">
                  {incidents.filter(i => i.status === 'in_progress').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">
                Assigned: <span className="text-blue-400 font-semibold">
                  {incidents.filter(i => i.status === 'assigned').length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">
                Resolved: <span className="text-green-400 font-semibold">
                  {incidents.filter(i => i.status === 'resolved').length}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
      {/* Incidents List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredIncidents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No incidents found</p>
            </motion.div>
          ) : (
            filteredIncidents.map((incident, index) => {
              const isExpanded = expandedIncident === incident.id;
              const assignment = assignments[incident.id];

              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300"
                >
                  {/* Main Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section - Main Info */}
                      <div className="flex-1 space-y-3">
                        {/* ID and Status */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-2xl font-bold text-blue-400">
                            #{incident.id}
                          </span>
                          {getStatusBadge(incident.status)}
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-base leading-relaxed">
                          {incident.description || 'No description provided'}
                        </p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {/* Reporter */}
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">Reporter:</span>
                            <span className="text-gray-200 font-medium">{incident.user}</span>
                          </div>

                          {/* Crime Type */}
                          {incident.crime_type && (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-400">Type:</span>
                              <span className="text-gray-200 font-medium">{incident.crime_type}</span>
                            </div>
                          )}

                          {/* Location */}
                          {incident.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-400">Location:</span>
                              <span className="text-gray-200 font-medium">{incident.location}</span>
                            </div>
                          )}

                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">Reported:</span>
                            <span className="text-gray-200 font-medium">
                              {formatDate(incident.reported_at)}
                            </span>
                          </div>
                        </div>

                        {/* Assignment Status */}
                        {incident.status !== 'in_progress' && (
                          <div className="flex items-center gap-2 pt-2">
                            <UserCheck className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400">
                              {incident.status === 'assigned' && assignment 
                                ? `Assigned to: ${assignment.assigned_to}`
                                : incident.status === 'resolved'
                                ? 'Case Resolved'
                                : 'Not Assigned'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col gap-2">
                        {/* View Details Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleExpand(incident.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Hide' : 'View'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.button>

                        {/* View Report Button (for resolved cases) */}
                        {incident.status === 'resolved' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {/* Handle view report */}}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Report</span>
                          </motion.button>
                        )}
                      </div>
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
                        <div className="p-6 bg-black/40 space-y-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Detailed Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Description */}
                            <div className="md:col-span-2">
                              <label className="text-sm text-gray-400 font-medium">Full Description</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {incident.description || 'No description provided'}
                              </p>
                            </div>

                            {/* Incident ID */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Incident ID</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                #{incident.id}
                              </p>
                            </div>

                            {/* Status */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Current Status</label>
                              <div className="mt-1 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {getStatusBadge(incident.status)}
                              </div>
                            </div>

                            {/* Reporter Email */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Reporter Email</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {incident.user}
                              </p>
                            </div>

                            {/* Crime Type */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Crime Type</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {incident.crime_type || 'Not specified'}
                              </p>
                            </div>

                            {/* Location */}
                            <div className="md:col-span-2">
                              <label className="text-sm text-gray-400 font-medium">Location</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {incident.location || 'Location not specified'}
                              </p>
                            </div>

                            {/* Reported At */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Reported At</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {formatDate(incident.reported_at)}
                              </p>
                            </div>

                            {/* Assignment Details */}
                            {assignment && (
                              <div>
                                <label className="text-sm text-gray-400 font-medium">Assigned To</label>
                                <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-blue-400" />
                                  {assignment.assigned_to}
                                </p>
                              </div>
                            )}

                            {assignment && assignment.assigned_at && (
                              <div>
                                <label className="text-sm text-gray-400 font-medium">Assigned At</label>
                                <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                  {formatDate(assignment.assigned_at)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Additional Actions for Resolved Cases */}
                          {incident.status === 'resolved' && (
                            <div className="pt-4 border-t border-gray-800">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {/* Handle view full report */}}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                              >
                                <FileText className="w-5 h-5" />
                                View Full Investigation Report
                              </motion.button>
                            </div>
                          )}
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

export default AllIncidents;
