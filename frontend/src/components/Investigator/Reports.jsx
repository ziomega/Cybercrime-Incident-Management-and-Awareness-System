import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  TrendingUp,
  PieChart,
  BarChart3,
  Search,
  Filter,
  Plus
} from 'lucide-react';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock reports data
  const reports = [
    {
      id: 1,
      case_id: 12,
      case_title: 'Identity Theft Case',
      report_type: 'Final Report',
      title: 'Identity Theft Investigation - Final Report',
      description: 'Comprehensive investigation report including suspect identification, evidence analysis, and recommended actions',
      status: 'approved',
      created_date: '2025-01-08T10:00:00Z',
      submitted_date: '2025-01-08T14:30:00Z',
      approved_date: '2025-01-08T16:45:00Z',
      approved_by: 'Senior Investigator James Wilson',
      pages: 24,
      attachments: 6
    },
    {
      id: 2,
      case_id: 1,
      case_title: 'Phishing Attack Investigation',
      report_type: 'Progress Report',
      title: 'Phishing Investigation - Progress Update',
      description: 'Mid-investigation progress report detailing findings and next steps',
      status: 'submitted',
      created_date: '2025-01-07T09:00:00Z',
      submitted_date: '2025-01-07T15:20:00Z',
      pages: 12,
      attachments: 3
    },
    {
      id: 3,
      case_id: 8,
      case_title: 'Cyberbullying Investigation',
      report_type: 'Preliminary Report',
      title: 'Cyberbullying Case - Initial Findings',
      description: 'Preliminary assessment of the cyberbullying case with initial evidence review',
      status: 'draft',
      created_date: '2025-01-06T11:30:00Z',
      pages: 8,
      attachments: 4
    },
    {
      id: 4,
      case_id: 5,
      case_title: 'E-commerce Fraud Case',
      report_type: 'Progress Report',
      title: 'E-commerce Fraud Investigation Update',
      description: 'Investigation progress including seller trace efforts and victim interviews',
      status: 'draft',
      created_date: '2025-01-05T14:00:00Z',
      pages: 10,
      attachments: 2
    },
    {
      id: 5,
      case_id: 15,
      case_title: 'Ransomware Attack',
      report_type: 'Final Report',
      title: 'Ransomware Investigation - Complete Analysis',
      description: 'Detailed analysis of ransomware attack vector, affected systems, and recovery procedures',
      status: 'approved',
      created_date: '2024-12-28T08:00:00Z',
      submitted_date: '2024-12-30T10:00:00Z',
      approved_date: '2024-12-31T14:00:00Z',
      approved_by: 'Chief Investigator Sarah Chen',
      pages: 32,
      attachments: 8
    }
  ];

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.case_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    draft: reports.filter(r => r.status === 'draft').length
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      approved: {
        colors: 'bg-green-500/10 text-green-400 border-green-500/30',
        icon: CheckCircle,
        label: 'Approved'
      },
      submitted: {
        colors: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        icon: Send,
        label: 'Under Review'
      },
      draft: {
        colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        icon: Edit,
        label: 'Draft'
      },
      rejected: {
        colors: 'bg-red-500/10 text-red-400 border-red-500/30',
        icon: AlertCircle,
        label: 'Rejected'
      }
    };

    const { colors, icon: Icon, label } = config[status] || config.draft;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  };

  // Get report type badge
  const getReportTypeBadge = (type) => {
    const colors = {
      'Final Report': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Progress Report': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Preliminary Report': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${colors[type] || 'bg-gray-500/20 text-gray-400'}`}>
        {type}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Investigation Reports</h1>
          <p className="text-gray-400 mt-1">Create, manage and submit case reports</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Create New Report
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'green' },
          { label: 'Under Review', value: stats.submitted, icon: Clock, color: 'orange' },
          { label: 'Drafts', value: stats.draft, icon: Edit, color: 'yellow' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 bg-${stat.color}-600/20 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reports..."
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
            <option value="approved">Approved</option>
            <option value="submitted">Under Review</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-400 font-bold">#{report.id}</span>
                  {getReportTypeBadge(report.report_type)}
                  {getStatusBadge(report.status)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{report.description}</p>
                <p className="text-sm text-blue-400">Case #{report.case_id} - {report.case_title}</p>
              </div>
              <div className="p-3 bg-purple-600/20 border border-purple-600/30 rounded-lg ml-4">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{report.pages} pages</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <PieChart className="w-4 h-4" />
                <span>{report.attachments} attachments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 col-span-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(report.created_date)}</span>
              </div>
            </div>

            {/* Status Timeline */}
            {report.submitted_date && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Send className="w-4 h-4" />
                  <span>Submitted: {formatDate(report.submitted_date)}</span>
                </div>
                {report.approved_date && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Approved: {formatDate(report.approved_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>By: {report.approved_by}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </motion.button>
              {report.status === 'draft' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No reports found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
