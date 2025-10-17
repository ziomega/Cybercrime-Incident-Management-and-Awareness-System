import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  User,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
  Clock,
  AlertCircle,
  Filter,
  X,
  Radio
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for different roles
const mockUsersData = {
  admin: [
    { id: 1, name: 'John Investigator', role: 'investigator', status: 'online', avatar: 'JI' },
    { id: 2, name: 'Sarah Investigator', role: 'investigator', status: 'offline', avatar: 'SI' },
    { id: 3, name: 'Mike Investigator', role: 'investigator', status: 'online', avatar: 'MI' },
    { id: 4, name: 'Emma Victim', role: 'victim', caseId: 'CASE-2024-001', status: 'online', avatar: 'EV' },
    { id: 5, name: 'Alex Victim', role: 'victim', caseId: 'CASE-2024-003', status: 'away', avatar: 'AV' },
  ],
  investigator: [
    { id: 1, name: 'Emma Victim', role: 'victim', caseId: 'CASE-2024-001', status: 'online', avatar: 'EV' },
    { id: 2, name: 'Robert Victim', role: 'victim', caseId: 'CASE-2024-005', status: 'offline', avatar: 'RV' },
    { id: 3, name: 'Admin Panel', role: 'admin', status: 'online', avatar: 'AP' },
  ],
  victim: [
    { id: 1, name: 'John Investigator', role: 'investigator', caseId: 'CASE-2024-001', status: 'online', avatar: 'JI' },
    { id: 2, name: 'Admin Panel', role: 'admin', status: 'online', avatar: 'AP' },
  ]
};

const mockMessagesData = {
  1: [
    { id: 1, text: 'Hello! I need to discuss the case progress.', sender: 'them', timestamp: '2024-01-10T10:30:00', status: 'read' },
    { id: 2, text: 'Sure, I\'ve reviewed the latest evidence. Let me share my findings.', sender: 'me', timestamp: '2024-01-10T10:32:00', status: 'read' },
    { id: 3, text: 'That would be great. I\'m particularly interested in the digital forensics report.', sender: 'them', timestamp: '2024-01-10T10:35:00', status: 'read' },
    { id: 4, text: 'I\'ll send you the detailed report by end of day.', sender: 'me', timestamp: '2024-01-10T10:37:00', status: 'delivered' },
  ],
  2: [
    { id: 1, text: 'Hi, any updates on my case?', sender: 'them', timestamp: '2024-01-10T09:15:00', status: 'read' },
    { id: 2, text: 'Yes, we\'ve made significant progress. The investigation is moving forward.', sender: 'me', timestamp: '2024-01-10T09:20:00', status: 'read' },
  ]
};

function Messaging() {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || 'investigator';
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastType, setBroadcastType] = useState('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Get available users based on role
  const availableUsers = mockUsersData[userRole] || [];

  // Filter users based on search
  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.caseId && u.caseId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    // Load mock messages
    setMessages(mockMessagesData);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg]
    }));

    setNewMessage('');
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;

    // Simulate sending broadcast
    console.log('Broadcasting to:', broadcastType, 'Message:', broadcastMessage);
    
    // Reset broadcast form
    setBroadcastMessage('');
    setShowBroadcast(false);
    
    // Show success message (you can add a toast notification here)
    alert(`Broadcast sent to ${broadcastType === 'all' ? 'all users' : broadcastType}!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const MessageStatus = ({ status }) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-5rem)]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-gray-400">
                {userRole === 'admin' && 'Communicate with investigators and victims'}
                {userRole === 'investigator' && 'Communicate with assigned victims and admin'}
                {userRole === 'victim' && 'Communicate with your investigator and admin'}
              </p>
            </div>

            {/* Admin Broadcast Button */}
            {userRole === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBroadcast(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Radio className="h-5 w-5" />
                Broadcast Message
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-8rem)]">
          
          {/* Users/Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-gray-900 rounded-lg border border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const userMessages = messages[user.id] || [];
                  const lastMessage = userMessages[userMessages.length - 1];
                  const unreadCount = userMessages.filter(m => m.sender === 'them' && m.status !== 'read').length;

                  return (
                    <motion.button
                      key={user.id}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full p-4 border-b border-gray-800 text-left transition-colors ${
                        selectedUser?.id === user.id ? 'bg-gray-800' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold">
                            {user.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${getStatusColor(user.status)}`} />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{user.name}</h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-400">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 truncate">
                              {user.caseId ? `Case: ${user.caseId}` : user.role}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {lastMessage.sender === 'me' ? 'You: ' : ''}{lastMessage.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gray-900 rounded-lg border border-gray-800 flex flex-col overflow-hidden"
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold">
                        {selectedUser.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${getStatusColor(selectedUser.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-400">
                        {selectedUser.caseId ? `Case: ${selectedUser.caseId}` : selectedUser.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Video className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(messages[selectedUser.id] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg p-3 ${
                          msg.sender === 'me' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-100'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
                          msg.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.sender === 'me' && <MessageStatus status={msg.status} />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Paperclip className="h-5 w-5 text-gray-400" />
                    </motion.button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Broadcast Modal (Admin Only) */}
      <AnimatePresence>
        {showBroadcast && userRole === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBroadcast(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Broadcast Message</h2>
                <button
                  onClick={() => setShowBroadcast(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Send to:
                  </label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="investigators">All Investigators</option>
                    <option value="victims">All Victims</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message:
                  </label>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Type your broadcast message..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendBroadcast}
                    disabled={!broadcastMessage.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                  >
                    Send Broadcast
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBroadcast(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
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

export default Messaging;