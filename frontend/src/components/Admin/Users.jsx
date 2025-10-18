import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Users as UsersIcon,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  TrendingUp,
  Eye,
  Edit2,
  Save,
  X as CloseIcon
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/users');
        setUsers(response.data.users || response.data);
        setFilteredUsers(response.data.users || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search, role, and status
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.id.toString().includes(searchQuery) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  // Get role badge styling
  const getRoleBadge = (role) => {
    const roleConfig = {
      victim: {
        icon: User,
        label: 'Victim/Reporter',
        colors: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      },
      investigator: {
        icon: Shield,
        label: 'Investigator',
        colors: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      },
      admin: {
        icon: Shield,
        label: 'Admin',
        colors: 'bg-red-500/10 text-red-400 border-red-500/30'
      },
      superadmin: {
        icon: Shield,
        label: 'Super Admin',
        colors: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      }
    };

    const config = roleConfig[role] || {
      icon: User,
      label: role,
      colors: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    };

    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.colors}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/30">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Active</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-gray-500/10 text-gray-400 border-gray-500/30">
        <UserX className="w-4 h-4" />
        <span className="text-sm font-medium">Inactive</span>
      </div>
    );
  };

  // Toggle user details
  const toggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Start editing role
  const startEditingRole = (userId, currentRole) => {
    setEditingRole(userId);
    setNewRole(currentRole);
    // Expand the user profile if not already expanded
    if (expandedUser !== userId) {
      setExpandedUser(userId);
    }
  };

  // Cancel editing role
  const cancelEditingRole = () => {
    setEditingRole(null);
    setNewRole('');
  };

  // Save role change
  const saveRoleChange = async (userId) => {
    try {
      // Make API call to update role
      await axiosInstance.put(`/users/${userId}`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setEditingRole(null);
      setNewRole('');
    } catch (err) {
      console.error('Error updating user role:', err);
      // Optionally show error message to user
      alert('Failed to update user role. Please try again.');
    }
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    victims: users.filter(u => u.role === 'victim').length,
    investigators: users.filter(u => u.role === 'investigator').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <UsersIcon className="w-10 h-10 text-blue-400 opacity-70" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Active</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.active}</p>
              </div>
              <UserCheck className="w-10 h-10 text-green-400 opacity-70" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-300">Victims</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.victims}</p>
              </div>
              <User className="w-10 h-10 text-cyan-400 opacity-70" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Investigators</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.investigators}</p>
              </div>
              <Shield className="w-10 h-10 text-purple-400 opacity-70" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Admins</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.admins}</p>
              </div>
              <Shield className="w-10 h-10 text-red-400 opacity-70" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Roles</option>
              <option value="victim">Victims</option>
              <option value="investigator">Investigators</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => {
              const isExpanded = expandedUser === user.id;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300"
                >
                  {/* Main Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section - User Info */}
                      <div className="flex-1 space-y-3">
                        {/* Name and ID */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-2xl font-bold text-white">
                            {user.first_name} {user.last_name}
                          </h2>
                          <span className="text-sm text-gray-500">ID: #{user.id}</span>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.is_active)}
                        </div>

                        {/* Email and Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Email */}
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">Email:</span>
                            <span className="text-gray-200 font-medium">{user.email}</span>
                          </div>

                          {/* Join Date */}
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">Joined:</span>
                            <span className="text-gray-200 font-medium">
                              {new Date(user.date_joined).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Last Login */}
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400">Last Login:</span>
                            <span className="text-gray-200 font-medium">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              }) : 'Never'}
                            </span>
                          </div>
                        </div>

                        {/* Activity Stats */}
                        {user.role === 'victim' && (
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400">Cases Reported:</span>
                              <span className="text-blue-400 font-semibold">{user.cases_reported || 0}</span>
                            </div>
                          </div>
                        )}

                        {user.role === 'investigator' && (
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-400">Cases Assigned:</span>
                              <span className="text-purple-400 font-semibold">{user.cases_assigned || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-gray-400">Resolved:</span>
                              <span className="text-green-400 font-semibold">{user.cases_resolved || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-400">Pending:</span>
                              <span className="text-yellow-400 font-semibold">{user.cases_pending || 0}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleExpand(user.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Hide' : 'View'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEditingRole(user.id, user.role)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit Role</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-800"
                      >
                        <div className="p-6 bg-black/40 space-y-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Detailed Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* User ID */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">User ID</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                #{user.id}
                              </p>
                            </div>

                            {/* Full Name */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Full Name</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {user.first_name} {user.last_name}
                              </p>
                            </div>

                            {/* Email Address */}
                            <div className="md:col-span-2">
                              <label className="text-sm text-gray-400 font-medium">Email Address</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user.email}
                              </p>
                            </div>

                            {/* Role */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Role</label>
                              {editingRole === user.id ? (
                                <div className="mt-1 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={newRole}
                                      onChange={(e) => setNewRole(e.target.value)}
                                      className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                      <option value="victim">Victim/Reporter</option>
                                      <option value="investigator">Investigator</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => saveRoleChange(user.id)}
                                      className="p-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                                    >
                                      <Save className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={cancelEditingRole}
                                      className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                      <CloseIcon className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                  {getRoleBadge(user.role)}
                                </div>
                              )}
                            </div>

                            {/* Status */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Account Status</label>
                              <div className="mt-1 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {getStatusBadge(user.is_active)}
                              </div>
                            </div>

                            {/* Date Joined */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Date Joined</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {formatDate(user.date_joined)}
                              </p>
                            </div>

                            {/* Last Login */}
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Last Login</label>
                              <p className="mt-1 text-gray-200 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {user.last_login ? formatDate(user.last_login) : 'Never logged in'}
                              </p>
                            </div>

                            {/* Activity Statistics - Victims */}
                            {user.role === 'victim' && (
                              <div>
                                <label className="text-sm text-gray-400 font-medium">Cases Reported</label>
                                <p className="mt-1 text-blue-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                  {user.cases_reported || 0}
                                </p>
                              </div>
                            )}

                            {/* Activity Statistics - Investigators */}
                            {user.role === 'investigator' && (
                              <>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Assigned</label>
                                  <p className="mt-1 text-purple-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_assigned || 0}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Resolved</label>
                                  <p className="mt-1 text-green-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_resolved || 0}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Pending</label>
                                  <p className="mt-1 text-yellow-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_pending || 0}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Success Rate</label>
                                  <p className="mt-1 text-cyan-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_assigned > 0 
                                      ? Math.round((user.cases_resolved / user.cases_assigned) * 100)
                                      : 0}%
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Users;
