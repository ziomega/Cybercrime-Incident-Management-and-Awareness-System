import { motion } from 'framer-motion';
import { Phone, ShieldCheck, ShieldOff, MessageSquare, Mail, ExternalLink, LifeBuoy, ArrowRight } from 'lucide-react';

function Support() {
  const journeySteps = [
    {
      id: 1,
      title: 'Immediate Help',
      subtitle: 'For urgent situations',
      icon: Phone,
      color: 'red',
      content: {
        type: 'contact',
        details: {
          name: 'Cybercrime Helpline',
          phone: '1-800-CYBER-HELP',
          hours: '24/7',
          description: 'Call for immediate assistance with active cybercrime incidents.',
        },
      },
    },
    {
      id: 2,
      title: 'Secure Yourself',
      subtitle: 'Critical first steps',
      icon: ShieldCheck,
      color: 'yellow',
      content: {
        type: 'dos_donts',
        dos: [
          'Document all incidents with dates and times.',
          'Save all evidence (screenshots, emails).',
          'Change passwords for affected accounts.',
        ],
        donts: [
          'Do not delete any potential evidence.',
          'Do not engage with the perpetrator.',
          'Do not pay any ransoms or demands.',
        ],
      },
    },
    {
      id: 3,
      title: 'Get Support',
      subtitle: 'Resources for recovery',
      icon: LifeBuoy,
      color: 'blue',
      content: {
        type: 'resources',
        items: [
          { title: 'Live Chat', icon: MessageSquare, action: 'Start Chat' },
          { title: 'Email Support', icon: Mail, action: 'Send Email' },
          { title: 'Knowledge Base', icon: ExternalLink, action: 'Visit Center' },
        ],
      },
    },
    {
      id: 4,
      title: 'Case Follow-up',
      subtitle: 'Contact your investigator',
      icon: ArrowRight,
      color: 'purple',
      content: {
        type: 'action',
        details: {
          title: 'Have an Active Case?',
          description: 'For case-specific questions, message your assigned investigator directly for the fastest response.',
          buttonText: 'Go to Messages',
          link: '/messages',
        },
      },
    },
  ];

  const getColor = (color) => {
    const colors = {
      red: { text: 'text-red-400', bg: 'bg-red-900/50', border: 'border-red-500/50', glow: 'shadow-red-500/30' },
      yellow: { text: 'text-yellow-400', bg: 'bg-yellow-900/50', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/30' },
      blue: { text: 'text-blue-400', bg: 'bg-blue-900/50', border: 'border-blue-500/50', glow: 'shadow-blue-500/30' },
      purple: { text: 'text-purple-400', bg: 'bg-purple-900/50', border: 'border-purple-500/50', glow: 'shadow-purple-500/30' },
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="space-y-12 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Your Path to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Support</span>
        </h1>
        <p className="text-lg text-gray-400">
          A step-by-step guide to help you navigate this situation.
        </p>
      </motion.div>

      {/* The Guided Journey */}
      <div className="relative">
        {/* The connecting line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-800" aria-hidden="true"></div>

        <div className="space-y-16">
          {journeySteps.map((step) => {
            const StepIcon = step.icon;
            const colors = getColor(step.color);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.id * 0.2, duration: 0.5 }}
                className="flex gap-6 items-start relative"
              >
                {/* Icon and Step Number */}
                <div className="flex-shrink-0 z-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colors.bg} border-2 ${colors.border} shadow-lg ${colors.glow}`}>
                    <StepIcon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-grow pt-1">
                  <h2 className={`text-2xl font-bold ${colors.text}`}>{step.title}</h2>
                  <p className="text-gray-500 mb-4">{step.subtitle}</p>

                                    <div className={`bg-gray-900/80 border border-gray-800 rounded-xl p-6 backdrop-blur-sm`}>
                    {step.content.type === 'contact' && (
                      <div>
                        <h3 className="font-bold text-lg mb-2">{step.content.details.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{step.content.details.description}</p>
                        <div className="flex items-center justify-between mt-6 bg-gray-800/50 p-4 rounded-lg">
                          <span className="font-mono text-2xl text-white">{step.content.details.phone}</span>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5, boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all"
                            onClick={() => window.location.href = `tel:${step.content.details.phone}`}
                            title="Call Now"
                          >
                            <Phone className="w-6 h-6" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                    
                    {step.content.type === 'dos_donts' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-400"><ShieldCheck /> Do's</h4>
                          <ul className="space-y-2 text-sm">
                            {step.content.dos.map((item, i) => <li key={i}>• {item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-400"><ShieldOff /> Don'ts</h4>
                          <ul className="space-y-2 text-sm">
                            {step.content.donts.map((item, i) => <li key={i}>• {item}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}

                    {step.content.type === 'resources' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {step.content.items.map((item, i) => {
                          const ItemIcon = item.icon;
                          return (
                            <motion.button key={i} whileHover={{ y: -3 }} className="bg-gray-800 hover:bg-gray-700/70 p-4 rounded-lg text-center transition-colors">
                              <ItemIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                              <span className="text-sm font-semibold">{item.title}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {step.content.type === 'action' && (
                      <div>
                        <h3 className="font-bold text-lg mb-2">{step.content.details.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{step.content.details.description}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          onClick={() => window.location.href = step.content.details.link}
                        >
                          {step.content.details.buttonText}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Support;
