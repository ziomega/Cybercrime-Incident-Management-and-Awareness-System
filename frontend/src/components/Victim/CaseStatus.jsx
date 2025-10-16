import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  Eye,
  Download,
  Filter
} from 'lucide-react';

function CaseStatus() {
  const [selectedCase, setSelectedCase] = useState('CASE-2024-001');

  // Mock data for cases
  const cases = [
    {
      id: 'CASE-2024-001',
      title: 'Identity Theft via Social Media',
      type: 'Identity Theft',
      status: 'In Progress',
      priority: 'high',
      investigator: {
        name: 'John Investigator',
        email: 'john.investigator@cimas.com',
        phone: '+1 (555) 123-4567',
        avatar: 'JI'
      },
      reportedDate: '2024-01-05',
      estimatedCompletion: '2024-01-25',
      progress: 65,
      currentStage: 'Evidence Analysis',
      stages: [
        { name: 'Incident Reported', status: 'completed', date: '2024-01-05', description: 'Case created and initial report filed' },
        { name: 'Case Assigned', status: 'completed', date: '2024-01-06', description: 'Assigned to investigator' },
        { name: 'Evidence Collection', status: 'completed', date: '2024-01-08', description: 'Initial evidence gathered and documented' },
        { name: 'Evidence Analysis', status: 'in-progress', date: '2024-01-10', description: 'Digital forensics and analysis ongoing' },
        { name: 'Investigation Report', status: 'pending', date: null, description: 'Comprehensive report preparation' },
        { name: 'Case Resolution', status: 'pending', date: null, description: 'Final actions and case closure' }
      ],
      updates: [
        { 
          id: 1, 
          date: '2024-01-10', 
          type: 'evidence', 
          message: 'New digital evidence analyzed. Found IP addresses linked to fake profile.',
          by: 'John Investigator' 
        },
        { 
          id: 2, 
          date: '2024-01-08', 
          type: 'progress', 
          message: 'Initial evidence collection completed. 8 pieces of evidence documented.',
          by: 'John Investigator' 
        },
        { 
          id: 3, 
          date: '2024-01-06', 
          type: 'assignment', 
          message: 'Case has been assigned to investigator John.',
          by: 'System' 
        },
        { 
          id: 4, 
          date: '2024-01-05', 
          type: 'report', 
          message: 'Incident reported and case created.',
          by: 'System' 
        }
      ],
      evidence: [
        { id: 1, name: 'Screenshot_FakeProfile.png', type: 'image', size: '2.4 MB', uploadDate: '2024-01-05', status: 'verified' },
        { id: 2, name: 'ConversationLog.pdf', type: 'document', size: '1.1 MB', uploadDate: '2024-01-05', status: 'verified' },
        { id: 3, name: 'IPAddressTrace.xlsx', type: 'document', size: '856 KB', uploadDate: '2024-01-08', status: 'verified' },
        { id: 4, name: 'ForensicReport.pdf', type: 'document', size: '3.2 MB', uploadDate: '2024-01-10', status: 'under-review' }
      ],
      documents: [
        { id: 1, name: 'Initial Incident Report', date: '2024-01-05', type: 'report' },
        { id: 2, name: 'Evidence Collection Log', date: '2024-01-08', type: 'log' },
        { id: 3, name: 'Preliminary Analysis', date: '2024-01-10', type: 'analysis' }
      ],
      metrics: {
        daysOpen: 6,
        evidenceCollected: 8,
        documentsGenerated: 3,
        lastActivity: '2 hours ago'
      }
    },
    {
      id: 'CASE-2024-003',
      title: 'Phishing Email Attack',
      type: 'Phishing',
      status: 'Under Review',
      priority: 'medium',
      investigator: {
        name: 'Sarah Investigator',
        email: 'sarah.investigator@cimas.com',
        phone: '+1 (555) 234-5678',
        avatar: 'SI'
      },
      reportedDate: '2024-01-08',
      estimatedCompletion: '2024-01-22',
      progress: 40,
      currentStage: 'Evidence Collection',
      stages: [
        { name: 'Incident Reported', status: 'completed', date: '2024-01-08', description: 'Case created and initial report filed' },
        { name: 'Case Assigned', status: 'completed', date: '2024-01-09', description: 'Assigned to investigator' },
        { name: 'Evidence Collection', status: 'in-progress', date: '2024-01-10', description: 'Gathering email headers and related information' },
        { name: 'Evidence Analysis', status: 'pending', date: null, description: 'Email forensics and source tracking' },
        { name: 'Investigation Report', status: 'pending', date: null, description: 'Comprehensive report preparation' },
        { name: 'Case Resolution', status: 'pending', date: null, description: 'Final actions and case closure' }
      ],
      updates: [
        { 
          id: 1, 
          date: '2024-01-10', 
          type: 'evidence', 
          message: 'Email headers extracted. Tracing source IP address.',
          by: 'Sarah Investigator' 
        },
        { 
          id: 2, 
          date: '2024-01-09', 
          type: 'assignment', 
          message: 'Case assigned to investigator Sarah.',
          by: 'System' 
        }
      ],
      evidence: [
        { id: 1, name: 'PhishingEmail.eml', type: 'email', size: '124 KB', uploadDate: '2024-01-08', status: 'verified' },
        { id: 2, name: 'EmailHeaders.txt', type: 'document', size: '45 KB', uploadDate: '2024-01-10', status: 'under-review' }
      ],
      documents: [
        { id: 1, name: 'Initial Report', date: '2024-01-08', type: 'report' }
      ],
      metrics: {
        daysOpen: 3,
        evidenceCollected: 4,
        documentsGenerated: 1,
        lastActivity: '1 day ago'
      }
    }
  ];

  const currentCase = cases.find(c => c.id === selectedCase);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Under Review': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'evidence': return Shield;
      case 'progress': return TrendingUp;
      case 'assignment': return User;
      case 'report': return FileText;
      default: return Clock;
    }
  };

  const getEvidenceStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'under-review': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Case Status</h1>
        <p className="text-gray-400">Track detailed progress of your cases</p>
      </motion.div>

      {/* Case Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cases.map(case_ => (
            <option key={case_.id} value={case_.id}>
              {case_.id} - {case_.title}
            </option>
          ))}
        </select>
      </motion.div>

      {currentCase && (
        <>
          {/* Case Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentCase.title}</h2>
                <p className="text-gray-400 mb-4">{currentCase.id} • {currentCase.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full border text-sm ${getStatusTextColor(currentCase.status)}`}>
                {currentCase.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-lg font-semibold">{currentCase.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${currentCase.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Current Stage: <span className="text-white">{currentCase.currentStage}</span></p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <Calendar className="h-5 w-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold mb-1">{currentCase.metrics.daysOpen}</p>
                <p className="text-sm text-gray-400">Days Open</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <Shield className="h-5 w-5 text-purple-400 mb-2" />
                <p className="text-2xl font-bold mb-1">{currentCase.metrics.evidenceCollected}</p>
                <p className="text-sm text-gray-400">Evidence Items</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <FileText className="h-5 w-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold mb-1">{currentCase.metrics.documentsGenerated}</p>
                <p className="text-sm text-gray-400">Documents</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <Clock className="h-5 w-5 text-yellow-400 mb-2" />
                <p className="text-sm font-semibold mb-1">{currentCase.metrics.lastActivity}</p>
                <p className="text-sm text-gray-400">Last Activity</p>
              </div>
            </div>
          </motion.div>

          {/* Investigation Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold mb-6">Investigation Timeline</h2>
            
            <div className="space-y-4">
              {currentCase.stages.map((stage, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(stage.status)} ring-4 ring-gray-900`} />
                    {index < currentCase.stages.length - 1 && (
                      <div className={`w-0.5 h-full mt-1 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`} style={{ minHeight: '60px' }} />
                    )}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{stage.name}</h3>
                      {stage.date && (
                        <span className="text-sm text-gray-400">{new Date(stage.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{stage.description}</p>
                    {stage.status === 'in-progress' && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investigator Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Assigned Investigator</h2>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold">
                  {currentCase.investigator.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{currentCase.investigator.name}</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>{currentCase.investigator.email}</p>
                    <p>{currentCase.investigator.phone}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Case Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4">Important Dates</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Reported Date</p>
                    <p className="font-semibold">{new Date(currentCase.reportedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Estimated Completion</p>
                    <p className="font-semibold">{new Date(currentCase.estimatedCompletion).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Days Remaining</p>
                    <p className="font-semibold text-blue-400">
                      {Math.ceil((new Date(currentCase.estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Evidence & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Evidence Files</h2>
                <span className="text-sm text-gray-400">{currentCase.evidence.length} files</span>
              </div>
              
              <div className="space-y-3">
                {currentCase.evidence.map(evidence => (
                  <div key={evidence.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{evidence.name}</p>
                        <p className="text-xs text-gray-400">{evidence.size} • {new Date(evidence.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getEvidenceStatusColor(evidence.status)}`}>
                        {evidence.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Case Documents</h2>
                <span className="text-sm text-gray-400">{currentCase.documents.length} documents</span>
              </div>
              
              <div className="space-y-3">
                {currentCase.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.type} • {new Date(doc.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
            <div className="space-y-4">
              {currentCase.updates.map(update => {
                const UpdateIcon = getUpdateIcon(update.type);
                return (
                  <div key={update.id} className="flex items-start gap-4 p-4 bg-gray-800/30 border border-gray-800 rounded-lg">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <UpdateIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400">{new Date(update.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">by {update.by}</span>
                      </div>
                      <p className="text-sm text-gray-300">{update.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default CaseStatus;
