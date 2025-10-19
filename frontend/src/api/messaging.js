import axiosInstance from './axiosConfig';

/**
 * Get list of users available for chat based on user role
 * @returns {Promise} List of available users
 */
export const getAvailableUsers = async () => {
  try {
    const response = await axiosInstance.get('/chat/available-users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching available users:', error);
    throw error;
  }
};

/**
 * Get messages for a specific conversation
 * @param {number} userId - ID of the user to get conversation with
 * @returns {Promise} List of messages
 */
export const getMessages = async (userId) => {
  try {
    const response = await axiosInstance.get('/chat/messages/', {
      params: { chat_with: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Get all messages (inbox)
 * @returns {Promise} List of all messages
 */
export const getAllMessages = async () => {
  try {
    const response = await axiosInstance.get('/chat/messages/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all messages:', error);
    throw error;
  }
};

/**
 * Send a message
 * @param {Object} messageData - Message data
 * @param {number|null} messageData.receiver - Receiver user ID (null for broadcast)
 * @param {string} messageData.content - Message content
 * @param {boolean} messageData.is_broadcast - Is broadcast message (admin only)
 * @returns {Promise} Created message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post('/chat/messages/', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark message as read
 * @param {number} messageId - Message ID
 * @returns {Promise} Updated message
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axiosInstance.patch(`/chat/messages/${messageId}/`, {
      read: true
    });
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

/**
 * Send broadcast message (admin only)
 * @param {Object} broadcastData - Broadcast data
 * @param {string} broadcastData.content - Message content
 * @param {string} broadcastData.broadcast_type - Type: 'all', 'investigators', 'victims'
 * @returns {Promise} Created broadcast message
 */
export const sendBroadcast = async (broadcastData) => {
  try {
    const response = await axiosInstance.post('/chat/messages/', {
      content: broadcastData.content,
      is_broadcast: true,
      receiver: null,
      broadcast_type: broadcastData.broadcast_type
    });
    return response.data;
  } catch (error) {
    console.error('Error sending broadcast:', error);
    throw error;
  }
};
