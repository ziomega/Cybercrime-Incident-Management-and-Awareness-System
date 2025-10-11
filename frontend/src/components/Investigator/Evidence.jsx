import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  File,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Evidence = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseFilter, setCaseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  // Mock evidence data
  const evidenceList = [
    {
      id: 1,
      case_id: 1,
      case_title: 'Phishing Attack Investigation',
      name: 'phishing_email_headers.pdf',
      type: 'document',
      size: '245 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-08T10:30:00Z',
      description: 'Email headers showing origin and routing information',
      status: 'verified',
      tags: ['email', 'headers', 'phishing']
    },
    {
      id: 2,
      case_id: 1,
      case_title: 'Phishing Attack Investigation',
      name: 'suspicious_link_analysis.pdf',
      type: 'document',
      size: '512 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-08T09:15:00Z',
      description: 'Analysis of malicious links found in phishing email',
      status: 'verified',
      tags: ['analysis', 'malware', 'links']
    },
    {
      id: 3,
      case_id: 8,
      case_title: 'Cyberbullying Investigation',
      name: 'threatening_messages_screenshot.png',
      type: 'image',
      size: '1.2 MB',
      uploaded_by: 'You',
      upload_date: '2025-01-08T11:20:00Z',
      description: 'Screenshots of threatening messages from social media',
      status: 'verified',
      tags: ['screenshot', 'messages', 'threat']
    },
    {
      id: 4,
      case_id: 8,
      case_title: 'Cyberbullying Investigation',
      name: 'account_activity_log.xlsx',
      type: 'document',
      size: '89 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-07T16:45:00Z',
      description: 'Login activity and IP addresses of suspect account',
      status: 'pending',
      tags: ['logs', 'activity', 'ip-trace']
    },
    {
      id: 5,
      case_id: 5,
      case_title: 'E-commerce Fraud Case',
      name: 'transaction_records.pdf',
      type: 'document',
      size: '324 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-07T14:20:00Z',
      description: 'Payment transaction records and receipts',
      status: 'verified',
      tags: ['payment', 'transaction', 'fraud']
    },
    {
      id: 6,
      case_id: 5,
      case_title: 'E-commerce Fraud Case',
      name: 'seller_communication.pdf',
      type: 'document',
      size: '178 KB',
      uploaded_by: 'david.brown@example.com',
      upload_date: '2025-01-06T10:30:00Z',
      description: 'Email and chat conversation with fraudulent seller',
      status: 'verified',
      tags: ['communication', 'chat', 'email']
    },
    {
      id: 7,
      case_id: 12,
      case_title: 'Identity Theft Case',
      name: 'stolen_credentials.txt',
      type: 'document',
      size: '12 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-05T09:00:00Z',
      description: 'List of compromised credentials and accounts',
      status: 'verified',
      tags: ['credentials', 'theft', 'breach']
    },
    {
      id: 8,
      case_id: 12,
      case_title: 'Identity Theft Case',
      name: 'suspect_photo.jpg',
      type: 'image',
      size: '856 KB',
      uploaded_by: 'You',
      upload_date: '2025-01-04T15:30:00Z',
      description: 'Surveillance photo of suspect from ATM camera',
      status: 'verified',
      tags: ['photo', 'surveillance', 'suspect']
    }
  ];

  // Get unique case IDs for filter
  const uniqueCases = [...new Set(evidenceList.map(e => e.case_id))];

  // Filter evidence
  const filteredEvidence = evidenceList.filter(evidence => {
    const matchesSearch = 
      evidence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evidence.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evidence.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCase = caseFilter === 'all' || evidence.case_id.toString() === caseFilter;
    const matchesType = typeFilter === 'all' || evidence.type === typeFilter;
    
    return matchesSearch && matchesCase && matchesType;
  });

  // Get file icon
  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      verified: {
        colors: 'bg-green-500/10 text-green-400 border-green-500/30',
        icon: CheckCircle,
        label: 'Verified'
      },
      pending: {
        colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        icon: Clock,
        label: 'Pending Review'
      },
      rejected: {
        colors: 'bg-red-500/10 text-red-400 border-red-500/30',
        icon: AlertCircle,
        label: 'Rejected'
      }
    };

    const { colors, icon: Icon, label } = config[status] || config.pending;

    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${colors}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
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
          <h1 className="text-3xl font-bold text-white">Evidence Management</h1>
          <p className="text-gray-400 mt-1">Upload, organize and manage case evidence</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
        >
          <Upload className="w-5 h-5" />
          Upload Evidence
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Evidence', value: evidenceList.length, icon: FileText, color: 'blue' },
          { label: 'Verified', value: evidenceList.filter(e => e.status === 'verified').length, icon: CheckCircle, color: 'green' },
          { label: 'Pending', value: evidenceList.filter(e => e.status === 'pending').length, icon: Clock, color: 'yellow' },
          { label: 'Total Size', value: '3.4 MB', icon: File, color: 'purple' }
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Cases</option>
            {uniqueCases.map(caseId => (
              <option key={caseId} value={caseId}>Case #{caseId}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvidence.map((evidence, index) => {
          const FileIcon = getFileIcon(evidence.type);
          return (
            <motion.div
              key={evidence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <FileIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{evidence.name}</h3>
                      <p className="text-sm text-blue-400">Case #{evidence.case_id} - {evidence.case_title}</p>
                    </div>
                    {getStatusBadge(evidence.status)}
                  </div>
                  <p className="text-gray-400 text-sm">{evidence.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {evidence.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{evidence.uploaded_by}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <File className="w-4 h-4" />
                  <span>{evidence.size}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 col-span-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(evidence.upload_date)}</span>
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
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvidence.length === 0 && (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No evidence found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Evidence;
