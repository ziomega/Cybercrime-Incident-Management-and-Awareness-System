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
  Radio,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAvailableUsers, 
  getMessages, 
  sendMessage, 
  sendBroadcast,
  getAllMessages,
  markMessageAsRead 
} from '../api/messaging';

function Messaging() {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || 'investigator';
  // Get user ID - could be 'id' or 'user_id' depending on JWT structure
  const userId = user?.id || user?.user_id;
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastType, setBroadcastType] = useState('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Filter users based on search
  const filteredUsers = availableUsers
    .filter(u => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const email = u.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    })
    .sort((a, b) => {
      // Sort by most recent message timestamp
      const aMessages = messages[a.id] || [];
      const bMessages = messages[b.id] || [];
      const aLastMessage = aMessages[aMessages.length - 1];
      const bLastMessage = bMessages[bMessages.length - 1];
      
      // If both have messages, compare timestamps
      if (aLastMessage && bLastMessage) {
        return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp);
      }
      // If only one has messages, prioritize it
      if (aLastMessage) return -1;
      if (bLastMessage) return 1;
      // If neither has messages, maintain original order
      return 0;
    });

  // Load available users and their conversations
  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        setLoading(true);
        const users = await getAvailableUsers();
        setAvailableUsers(users);
        
        // Fetch messages for all available users
        const allMessagesPromises = users.map(async (user) => {
          try {
            const msgs = await getMessages(user.id);
            return {
              userId: user.id,
              messages: msgs.map(msg => ({
                id: msg.id,
                text: msg.content,
                sender: Number(msg.sender) === Number(userId) ? 'me' : 'them',
                timestamp: msg.timestamp,
                status: msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent',
                originalRead: msg.read
              }))
            };
          } catch (err) {
            console.error(`Error loading messages for user ${user.id}:`, err);
            return { userId: user.id, messages: [] };
          }
        });

        const allMessagesResults = await Promise.all(allMessagesPromises);
        
        // Convert array to object keyed by userId
        const messagesObj = {};
        allMessagesResults.forEach(result => {
          messagesObj[result.userId] = result.messages;
        });
        
        setMessages(messagesObj);
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUsersAndMessages();
    }
  }, [userId]);

  // Load messages when user is selected and mark as read
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      
      try {
        const msgs = await getMessages(selectedUser.id);
        console.log('Fetched messages:', msgs);
        console.log('Current user ID:', userId);
        
        // Identify unread messages from the other user that need to be marked as read
        const unreadMessagesToMark = msgs.filter(
          msg => Number(msg.sender) !== Number(userId) && !msg.read
        );
        
        setMessages(prev => ({
          ...prev,
          [selectedUser.id]: msgs.map(msg => {
            const isMine = Number(msg.sender) === Number(userId);
            console.log(`Message ${msg.id}: sender=${msg.sender}, userId=${userId}, isMine=${isMine}`);
            return {
              id: msg.id,
              text: msg.content,
              sender: isMine ? 'me' : 'them',
              timestamp: msg.timestamp,
              status: msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent',
              originalRead: msg.read  // Keep track of original read status
            };
          })
        }));
        
        // Mark unread messages as read (don't await to avoid blocking UI)
        unreadMessagesToMark.forEach(async (msg) => {
          try {
            await markMessageAsRead(msg.id);
            console.log(`Marked message ${msg.id} as read`);
            
            // Update the message status in state after marking as read
            setMessages(prev => ({
              ...prev,
              [selectedUser.id]: prev[selectedUser.id]?.map(m => 
                m.id === msg.id ? { ...m, status: 'read', originalRead: true } : m
              ) || []
            }));
          } catch (err) {
            console.error(`Failed to mark message ${msg.id} as read:`, err);
          }
        });
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchMessages();
    // Poll for new messages every 5 seconds when a conversation is selected
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedUser, userId]);

  // Periodic refresh of all conversations (every 10 seconds)
  useEffect(() => {
    if (!availableUsers.length || !userId) return;

    const refreshAllConversations = async () => {
      try {
        setRefreshing(true);
        const allMessagesPromises = availableUsers.map(async (user) => {
          try {
            const msgs = await getMessages(user.id);
            return {
              userId: user.id,
              messages: msgs.map(msg => ({
                id: msg.id,
                text: msg.content,
                sender: Number(msg.sender) === Number(userId) ? 'me' : 'them',
                timestamp: msg.timestamp,
                status: msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent',
                originalRead: msg.read
              }))
            };
          } catch (err) {
            console.error(`Error refreshing messages for user ${user.id}:`, err);
            return null;
          }
        });

        const results = await Promise.all(allMessagesPromises);
        
        // Update messages state with new data
        setMessages(prev => {
          const updated = { ...prev };
          results.forEach(result => {
            if (result) {
              updated[result.userId] = result.messages;
            }
          });
          return updated;
        });
      } catch (err) {
        console.error('Error refreshing conversations:', err);
      } finally {
        setRefreshing(false);
      }
    };

    // Refresh all conversations every 10 seconds
    const interval = setInterval(refreshAllConversations, 10000);
    return () => clearInterval(interval);
  }, [availableUsers, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setSending(true);
      const sentMsg = await sendMessage({
        receiver: selectedUser.id,
        content: newMessage,
        is_broadcast: false
      });

      // Add message to local state
      const newMsg = {
        id: sentMsg.id,
        text: sentMsg.content,
        sender: 'me',
        timestamp: sentMsg.timestamp,
        status: 'sent'
      };

      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg]
      }));

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;

    try {
      setSending(true);
      await sendBroadcast({
        content: broadcastMessage,
        broadcast_type: broadcastType
      });
      
      // Reset broadcast form
      setBroadcastMessage('');
      setShowBroadcast(false);
      
      alert(`Broadcast sent to ${broadcastType === 'all' ? 'all users' : broadcastType}!`);
    } catch (err) {
      console.error('Error sending broadcast:', err);
      alert('Failed to send broadcast. Please try again.');
    } finally {
      setSending(false);
    }
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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold mb-2">Messages</h1>
                {refreshing && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Syncing...</span>
                  </div>
                )}
              </div>
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
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <Loader className="h-12 w-12 mx-auto mb-3 opacity-50 animate-spin" />
                  <p>Loading conversations...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{error}</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredUsers.map((chatUser) => {
                  const userMessages = messages[chatUser.id] || [];
                  const lastMessage = userMessages[userMessages.length - 1];
                  const unreadCount = userMessages.filter(m => m.sender === 'them' && m.status !== 'read').length;
                  const userName = `${chatUser.first_name} ${chatUser.last_name}`;

                  return (
                    <motion.button
                      key={chatUser.id}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      onClick={() => setSelectedUser(chatUser)}
                      className={`w-full p-4 border-b border-gray-800 text-left transition-colors ${
                        selectedUser?.id === chatUser.id ? 'bg-gray-800' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold text-sm">
                            {chatUser.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${getStatusColor(chatUser.status)}`} />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{userName}</h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-400">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 truncate">
                              {chatUser.role}
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
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-semibold text-sm">
                        {selectedUser.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${getStatusColor(selectedUser.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{`${selectedUser.first_name} ${selectedUser.last_name}`}</h3>
                      <p className="text-sm text-gray-400">
                        {selectedUser.role} • {selectedUser.email}
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
                      disabled={!newMessage.trim() || sending}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {sending ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
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
                    disabled={!broadcastMessage.trim() || sending}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Broadcast'
                    )}
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