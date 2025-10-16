import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
  Shield,
  Phone,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Video,
  FileQuestion,
  Scale,
  Heart
} from 'lucide-react';

function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  // Mock data for resources
  const categories = [
    { id: 'all', label: 'All Resources', icon: FileText },
    { id: 'guides', label: 'Safety Guides', icon: Shield },
    { id: 'legal', label: 'Legal Information', icon: Scale },
    { id: 'support', label: 'Support Services', icon: Heart },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'videos', label: 'Educational Videos', icon: Video }
  ];

  const resources = [
    {
      id: 1,
      title: 'Complete Guide to Identity Theft Protection',
      category: 'guides',
      type: 'PDF Guide',
      size: '2.4 MB',
      pages: 24,
      description: 'A comprehensive guide covering prevention, detection, and recovery from identity theft incidents.',
      topics: ['Prevention Tips', 'Warning Signs', 'Recovery Steps', 'Legal Rights'],
      downloadCount: 1247,
      lastUpdated: '2024-01-01',
      icon: Shield,
      featured: true
    },
    {
      id: 2,
      title: 'Understanding Cybercrime Laws in Your Region',
      category: 'legal',
      type: 'Legal Document',
      size: '1.8 MB',
      pages: 18,
      description: 'Detailed information about cybercrime legislation, victim rights, and legal procedures.',
      topics: ['Criminal Law', 'Victim Rights', 'Court Procedures', 'Compensation'],
      downloadCount: 892,
      lastUpdated: '2023-12-15',
      icon: Scale,
      featured: true
    },
    {
      id: 3,
      title: 'Phishing Attack Recognition & Response',
      category: 'guides',
      type: 'Quick Reference',
      size: '856 KB',
      pages: 8,
      description: 'Learn to identify phishing attempts and take immediate protective actions.',
      topics: ['Email Security', 'Red Flags', 'Reporting', 'Account Protection'],
      downloadCount: 2134,
      lastUpdated: '2024-01-05',
      icon: AlertTriangle,
      featured: false
    },
    {
      id: 4,
      title: 'Mental Health Support for Cybercrime Victims',
      category: 'support',
      type: 'Support Resource',
      size: '1.2 MB',
      pages: 12,
      description: 'Information about counseling services, support groups, and coping strategies.',
      topics: ['Counseling Services', 'Support Groups', 'Coping Strategies', 'Helplines'],
      downloadCount: 654,
      lastUpdated: '2023-12-20',
      icon: Heart,
      featured: false
    },
    {
      id: 5,
      title: 'Evidence Collection Best Practices',
      category: 'guides',
      type: 'Tutorial',
      size: '3.1 MB',
      pages: 16,
      description: 'Step-by-step guide on collecting and preserving digital evidence.',
      topics: ['Screenshots', 'Email Headers', 'Transaction Records', 'Chain of Custody'],
      downloadCount: 1567,
      lastUpdated: '2023-12-28',
      icon: FileText,
      featured: true
    },
    {
      id: 6,
      title: 'Frequently Asked Questions',
      category: 'faq',
      type: 'FAQ Document',
      size: '642 KB',
      pages: 10,
      description: 'Answers to common questions about reporting, investigation process, and victim support.',
      topics: ['Reporting Process', 'Investigation Timeline', 'Evidence Requirements', 'Case Updates'],
      downloadCount: 3421,
      lastUpdated: '2024-01-08',
      icon: HelpCircle,
      featured: false
    },
    {
      id: 7,
      title: 'Online Safety for Social Media Users',
      category: 'guides',
      type: 'Video Tutorial',
      size: '45.2 MB',
      duration: '15:30',
      description: 'Video guide covering privacy settings, safe sharing practices, and threat awareness.',
      topics: ['Privacy Settings', 'Safe Sharing', 'Account Security', 'Reporting Abuse'],
      downloadCount: 892,
      lastUpdated: '2024-01-03',
      icon: Video,
      featured: false
    },
    {
      id: 8,
      title: 'Financial Fraud Recovery Checklist',
      category: 'guides',
      type: 'Checklist',
      size: '421 KB',
      pages: 6,
      description: 'Step-by-step checklist for recovering from financial cybercrime.',
      topics: ['Bank Notification', 'Credit Monitoring', 'Fraud Alerts', 'Documentation'],
      downloadCount: 1123,
      lastUpdated: '2023-12-10',
      icon: FileQuestion,
      featured: false
    }
  ];

  const emergencyContacts = [
    {
      id: 1,
      name: 'Cybercrime Helpline',
      phone: '1-800-CYBER-HELP',
      hours: '24/7',
      description: 'Immediate assistance for active cybercrime situations'
    },
    {
      id: 2,
      name: 'Victim Support Services',
      phone: '1-888-VICTIM-1',
      hours: 'Mon-Fri, 9 AM - 6 PM',
      description: 'Counseling and support for cybercrime victims'
    },
    {
      id: 3,
      name: 'Legal Aid Hotline',
      phone: '1-877-LEGAL-AID',
      hours: 'Mon-Fri, 8 AM - 8 PM',
      description: 'Free legal consultation for victims'
    }
  ];

  const externalLinks = [
    {
      id: 1,
      name: 'National Cybersecurity Alliance',
      url: 'https://staysafeonline.org',
      description: 'Educational resources and awareness campaigns'
    },
    {
      id: 2,
      name: 'FBI Internet Crime Complaint Center',
      url: 'https://www.ic3.gov',
      description: 'Report cybercrimes to federal authorities'
    },
    {
      id: 3,
      name: 'Identity Theft Resource Center',
      url: 'https://www.idtheftcenter.org',
      description: 'Identity theft prevention and recovery'
    }
  ];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Resources & Support</h1>
        <p className="text-gray-400">Access helpful guides, legal information, and support services</p>
      </motion.div>

      {/* Emergency Contacts Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-lg">
            <Phone className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-3">Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{contact.name}</h3>
                  <p className="text-lg text-red-400 font-mono mb-1">{contact.phone}</p>
                  <p className="text-xs text-gray-400 mb-2">{contact.hours}</p>
                  <p className="text-sm text-gray-300">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredResources.map((resource, index) => {
            const ResourceIcon = resource.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 cursor-pointer hover:border-blue-500/50 transition-colors"
                onClick={() => setSelectedResource(resource)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <ResourceIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full">
                    Featured
                  </span>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{resource.type}</span>
                  <span>{resource.downloadCount} downloads</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 overflow-x-auto pb-2"
      >
        {categories.map(category => {
          const CategoryIcon = category.icon;
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              <CategoryIcon className="h-4 w-4" />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search resources by title, topic, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>

      {/* Resources List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">All Resources</h2>
          <span className="text-sm text-gray-400">{filteredResources.length} resources</span>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, index) => {
            const ResourceIcon = resource.icon;
            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <ResourceIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{resource.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {resource.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.size}</span>
                        {resource.pages && (
                          <>
                            <span>•</span>
                            <span>{resource.pages} pages</span>
                          </>
                        )}
                        {resource.duration && (
                          <>
                            <span>•</span>
                            <span>{resource.duration}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{resource.downloadCount} downloads</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedResource(resource)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No resources found matching your criteria</p>
          </motion.div>
        )}
      </div>

      {/* External Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">External Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {externalLinks.map(link => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="flex items-start gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">{link.name}</h3>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Resource Preview Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {selectedResource.icon && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <selectedResource.icon className="h-8 w-8 text-blue-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedResource.title}</h2>
                    <p className="text-gray-400">{selectedResource.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-2xl p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{selectedResource.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.topics.map((topic, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">File Size</h3>
                    <p className="text-lg">{selectedResource.size}</p>
                  </div>
                  {selectedResource.pages && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm text-gray-400">Pages</h3>
                      <p className="text-lg">{selectedResource.pages}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">Downloads</h3>
                    <p className="text-lg">{selectedResource.downloadCount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-400">Last Updated</h3>
                    <p className="text-lg">{new Date(selectedResource.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    <Download className="h-5 w-5" />
                    Download Resource
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedResource(null)}
                    className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Resources;
