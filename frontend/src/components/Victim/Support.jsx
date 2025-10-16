import { motion } from 'framer-motion';
import { Phone, Clock, MessageCircle, Mail, ExternalLink } from 'lucide-react';

function Support() {
  const emergencyContacts = [
    {
      id: 1,
      name: 'Cybercrime Helpline',
      phone: '1-800-CYBER-HELP',
      hours: '24/7',
      description: 'Immediate assistance for active cybercrime situations',
      color: 'from-red-600 to-orange-600',
      available: true
    },
    {
      id: 2,
      name: 'Victim Support Services',
      phone: '1-888-VICTIM-1',
      hours: 'Mon-Fri, 9 AM - 6 PM',
      description: 'Counseling and support for cybercrime victims',
      color: 'from-purple-600 to-pink-600',
      available: true
    },
    {
      id: 3,
      name: 'Legal Aid Hotline',
      phone: '1-877-LEGAL-AID',
      hours: 'Mon-Fri, 8 AM - 8 PM',
      description: 'Free legal consultation for victims',
      color: 'from-blue-600 to-cyan-600',
      available: false
    }
  ];

  const additionalResources = [
    {
      id: 1,
      title: 'Online Chat Support',
      description: 'Connect with a support specialist via live chat',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: Mail,
      action: 'Send Email',
      color: 'green'
    },
    {
      id: 3,
      title: 'Support Center',
      description: 'Browse our knowledge base and FAQs',
      icon: ExternalLink,
      action: 'Visit Center',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Emergency Contacts & Support</h1>
        <p className="text-gray-400">Get immediate help and support for your cybercrime case</p>
      </motion.div>

      {/* Emergency Contacts - Prominent Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-red-900/20 via-gray-900 to-orange-900/20 border-2 border-red-500/40 rounded-lg p-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/20 rounded-lg">
            <Phone className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">Emergency Contacts</h2>
            <p className="text-gray-300">Call these numbers for immediate assistance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gradient-to-br ${contact.color} rounded-lg p-6 h-full shadow-xl hover:shadow-2xl transition-all`}
              >
                {contact.available && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                      Available Now
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 text-white">{contact.name}</h3>
                  <p className="text-sm text-white/80">{contact.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <Phone className="h-5 w-5" />
                    <span className="text-2xl font-bold font-mono">{contact.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{contact.hours}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  onClick={() => window.location.href = `tel:${contact.phone}`}
                >
                  Call Now
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-3 text-blue-400">When to Call Emergency Contacts</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>You are experiencing an active cybercrime incident</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>You need immediate legal advice or guidance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>You require emotional support or counseling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>You have urgent questions about your case</span>
          </li>
        </ul>
      </motion.div>

      {/* Additional Support Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Additional Support Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {additionalResources.map((resource, index) => {
            const ResourceIcon = resource.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                <div className={`p-3 bg-${resource.color}-500/10 border border-${resource.color}-500/30 rounded-lg inline-block mb-4`}>
                  <ResourceIcon className={`h-6 w-6 text-${resource.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{resource.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full px-4 py-2 bg-${resource.color}-600 hover:bg-${resource.color}-700 rounded-lg transition-colors text-sm font-medium`}
                >
                  {resource.action}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4">Safety Tips While Getting Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-green-400">✓ Do</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Document all incidents with dates and times</li>
              <li>• Save all evidence (screenshots, emails, messages)</li>
              <li>• Change your passwords immediately</li>
              <li>• Keep a record of who you speak with</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-red-400">✗ Don't</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Don't delete any evidence</li>
              <li>• Don't confront the perpetrator</li>
              <li>• Don't pay any ransom demands</li>
              <li>• Don't share case details on social media</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Contact Your Investigator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-3">Have a Case? Contact Your Investigator</h3>
        <p className="text-gray-300 mb-4">
          If you already have an active case, you can message your assigned investigator directly for case-specific questions and updates.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          onClick={() => window.location.href = '/messages'}
        >
          Go to Messages
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Support;
