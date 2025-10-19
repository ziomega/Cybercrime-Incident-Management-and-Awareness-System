import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  FileText,
  Eye,
  MessageSquare,
  MapPin,
  TrendingUp,
  Upload,
  X,
  AlertCircle
} from 'lucide-react';

function MyIncidents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    crimeType: '',
    description: '',
    location: '',
    dateOccurred: '',
    evidenceFiles: []
  });

  // Mock data for incidents
  const incidents = [
    {
      id: 'INC-2024-001',
      caseId: 'CASE-2024-001',
      title: 'Identity Theft via Social Media',
      type: 'Identity Theft',
      status: 'In Progress',
      priority: 'high',
      reportedDate: '2024-01-05',
      investigator: 'John Investigator',
      description: 'Someone created a fake profile using my personal information and photos.',
      location: 'Online - Facebook',
      evidenceCount: 8,
      lastUpdate: '2 hours ago',
      progress: 65,
      timeline: [
        { date: '2024-01-05', event: 'Incident reported', type: 'report' },
        { date: '2024-01-06', event: 'Case assigned to investigator', type: 'assign' },
        { date: '2024-01-08', event: 'Initial evidence collected', type: 'evidence' },
        { date: '2024-01-10', event: 'Digital forensics in progress', type: 'progress' }
      ]
    },
    {
      id: 'INC-2024-002',
      caseId: 'CASE-2024-002',
      title: 'Online Harassment Campaign',
      type: 'Cyberbullying',
      status: 'Resolved',
      priority: 'medium',
      reportedDate: '2023-12-20',
      investigator: 'Sarah Investigator',
      description: 'Receiving threatening messages and harassment across multiple platforms.',
      location: 'Online - Multiple Platforms',
      evidenceCount: 15,
      lastUpdate: '5 days ago',
      progress: 100,
      resolution: 'Perpetrator identified and legal action initiated',
      timeline: [
        { date: '2023-12-20', event: 'Incident reported', type: 'report' },
        { date: '2023-12-21', event: 'Case assigned', type: 'assign' },
        { date: '2023-12-28', event: 'Evidence analyzed', type: 'evidence' },
        { date: '2024-01-02', event: 'Case resolved', type: 'resolved' }
      ]
    },
    {
      id: 'INC-2024-003',
      caseId: 'CASE-2024-003',
      title: 'Phishing Email Attack',
      type: 'Phishing',
      status: 'Under Review',
      priority: 'medium',
      reportedDate: '2024-01-08',
      investigator: 'Sarah Investigator',
      description: 'Received suspicious emails claiming to be from my bank requesting account details.',
      location: 'Email',
      evidenceCount: 4,
      lastUpdate: '1 day ago',
      progress: 40,
      timeline: [
        { date: '2024-01-08', event: 'Incident reported', type: 'report' },
        { date: '2024-01-09', event: 'Case assigned', type: 'assign' },
        { date: '2024-01-10', event: 'Evidence under review', type: 'progress' }
      ]
    },
    {
      id: 'INC-2023-045',
      caseId: 'CASE-2023-045',
      title: 'Credit Card Fraud',
      type: 'Financial Fraud',
      status: 'Resolved',
      priority: 'high',
      reportedDate: '2023-11-15',
      investigator: 'Mike Investigator',
      description: 'Unauthorized transactions detected on my credit card.',
      location: 'Online - E-commerce',
      evidenceCount: 12,
      lastUpdate: '2 weeks ago',
      progress: 100,
      resolution: 'Funds recovered, perpetrator arrested',
      timeline: [
        { date: '2023-11-15', event: 'Incident reported', type: 'report' },
        { date: '2023-11-16', event: 'Case assigned', type: 'assign' },
        { date: '2023-11-25', event: 'Investigation completed', type: 'progress' },
        { date: '2023-12-05', event: 'Case resolved', type: 'resolved' }
      ]
    },
    {
      id: 'INC-2024-004',
      caseId: 'CASE-2024-004',
      title: 'Ransomware Attack',
      type: 'Malware',
      status: 'Pending',
      priority: 'high',
      reportedDate: '2024-01-11',
      investigator: null,
      description: 'My computer was infected with ransomware demanding payment.',
      location: 'Personal Computer',
      evidenceCount: 2,
      lastUpdate: 'Just now',
      progress: 10,
      timeline: [
        { date: '2024-01-11', event: 'Incident reported', type: 'report' }
      ]
    }
  ];

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         incident.status.toLowerCase().replace(' ', '-') === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Under Review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Resolved': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Pending': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'report': return AlertTriangle;
      case 'assign': return User;
      case 'evidence': return FileText;
      case 'progress': return TrendingUp;
      case 'resolved': return Clock;
      default: return Clock;
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend API
    console.log('Submitting incident report:', reportForm);
    
    // Simulate successful submission
    alert('Incident reported successfully! You will be notified once an investigator is assigned.');
    
    // Reset form and close modal
    setReportForm({
      title: '',
      crimeType: '',
      description: '',
      location: '',
      dateOccurred: '',
      evidenceFiles: []
    });
    setShowReportModal(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setReportForm({ ...reportForm, evidenceFiles: [...reportForm.evidenceFiles, ...files] });
  };

  const removeFile = (index) => {
    const newFiles = reportForm.evidenceFiles.filter((_, i) => i !== index);
    setReportForm({ ...reportForm, evidenceFiles: newFiles });
  };

  const crimeTypes = [
    'Phishing',
    'Ransomware',
    'Identity Theft',
    'Account Takeover',
    'E-commerce Fraud',
    'Data Breach',
    'Cryptocurrency Theft',
    'Cyberbullying',
    'BEC Attack',
    'Malware',
    'DDoS Attack',
    'Social Engineering',
    'Credit Card Fraud',
    'Spyware',
    'Online Harassment',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">My Incidents</h1>
          <p className="text-gray-400">Track and manage all your reported incidents</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Report New Incident
        </motion.button>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: incidents.length, color: 'blue' },
          { label: 'In Progress', value: incidents.filter(i => i.status === 'In Progress').length, color: 'cyan' },
          { label: 'Resolved', value: incidents.filter(i => i.status === 'Resolved').length, color: 'green' },
          { label: 'Pending', value: incidents.filter(i => i.status === 'Pending').length, color: 'gray' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-900 border border-gray-800 rounded-lg p-4 text-center`}
          >
            <h3 className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</h3>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search incidents by title, type, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </motion.div>

      {/* Incidents List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredIncidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{incident.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="font-mono">{incident.id}</span>
                    <span>•</span>
                    <span>{incident.type}</span>
                    {incident.caseId && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">{incident.caseId}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full border text-sm ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{incident.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Reported: {new Date(incident.reportedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{incident.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span>{incident.evidenceCount} Evidence files</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Updated {incident.lastUpdate}</span>
                </div>
              </div>

              {incident.investigator && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <User className="h-4 w-4" />
                  <span>Assigned to: <span className="text-white">{incident.investigator}</span></span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{incident.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${incident.progress}%` }}
                  />
                </div>
              </div>

              {/* Resolution */}
              {incident.resolution && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-400">
                    <strong>Resolution:</strong> {incident.resolution}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIncident(incident)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </motion.button>
                {incident.investigator && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/messages', { state: { investigator: incident.investigator, caseId: incident.caseId } })}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message Investigator
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredIncidents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No incidents found matching your criteria</p>
          </motion.div>
        )}
      </div>

      {/* Incident Detail Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedIncident.title}</h2>
                  <p className="text-gray-400">{selectedIncident.id}</p>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                  <div className="space-y-3">
                    {selectedIncident.timeline.map((event, index) => {
                      const TimelineIcon = getTimelineIcon(event.type);
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <TimelineIcon className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">{event.event}</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Incident Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Report New Incident</h2>
                  <p className="text-gray-400">Provide details about the cybercrime incident</p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleReportSubmit} className="space-y-6">
                {/* Alert Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Important:</p>
                    <p>Your report will be reviewed and assigned to an investigator. Please provide as much detail as possible to help with the investigation.</p>
                  </div>
                </div>

                {/* Incident Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Incident Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    placeholder="Brief description of the incident"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Crime Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Crime Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={reportForm.crimeType}
                    onChange={(e) => setReportForm({ ...reportForm, crimeType: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select crime type</option>
                    {crimeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Detailed Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    placeholder="Describe what happened in detail. Include dates, times, platforms, usernames, URLs, or any other relevant information..."
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 50 characters</p>
                </div>

                {/* Location & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location/Platform
                    </label>
                    <input
                      type="text"
                      value={reportForm.location}
                      onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                      placeholder="e.g., Facebook, Email, Website URL"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date Occurred */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Occurred <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.dateOccurred}
                      onChange={(e) => setReportForm({ ...reportForm, dateOccurred: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Evidence Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Evidence Files
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-upload"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="evidence-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400 mb-1">
                        Click to upload evidence files
                      </p>
                      <p className="text-xs text-gray-500">
                        Screenshots, documents, emails, etc. (Max 10MB per file)
                      </p>
                    </label>
                  </div>

                  {/* File List */}
                  {reportForm.evidenceFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {reportForm.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                          >
                            <X className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    Submit Report
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyIncidents;
