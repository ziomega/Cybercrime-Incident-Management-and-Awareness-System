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
  Eye
} from 'lucide-react';

const Users = () => {
  // Mock data for users
  const mockUsers = [
    {
      id: 1,
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'victim',
      date_joined: '2024-06-15T10:30:00Z',
      last_login: '2025-01-08T14:22:00Z',
      is_active: true,
      cases_reported: 3,
      cases_resolved: 2,
      cases_pending: 1
    },
    {
      id: 2,
      email: 'sarah.chen@cybercrime.gov',
      first_name: 'Sarah',
      last_name: 'Chen',
      role: 'investigator',
      date_joined: '2023-03-20T09:00:00Z',
      last_login: '2025-01-08T15:45:00Z',
      is_active: true,
      cases_reported: 0,
      cases_assigned: 12,
      cases_solved: 9,
      cases_in_progress: 3
    },
    {
      id: 3,
      email: 'mike.johnson@example.com',
      first_name: 'Mike',
      last_name: 'Johnson',
      role: 'victim',
      date_joined: '2024-08-22T11:15:00Z',
      last_login: '2025-01-07T09:30:00Z',
      is_active: true,
      cases_reported: 5,
      cases_resolved: 4,
      cases_pending: 1
    },
    {
      id: 4,
      email: 'admin@cybercrime.gov',
      first_name: 'Admin',
      last_name: 'Smith',
      role: 'admin',
      date_joined: '2023-01-10T08:00:00Z',
      last_login: '2025-01-08T16:00:00Z',
      is_active: true,
      cases_reported: 0
    },
    {
      id: 5,
      email: 'emma.davis@example.com',
      first_name: 'Emma',
      last_name: 'Davis',
      role: 'victim',
      date_joined: '2024-09-10T13:20:00Z',
      last_login: '2025-01-06T12:10:00Z',
      is_active: true,
      cases_reported: 2,
      cases_resolved: 1,
      cases_pending: 1
    },
    {
      id: 6,
      email: 'michael.roberts@cybercrime.gov',
      first_name: 'Michael',
      last_name: 'Roberts',
      role: 'investigator',
      date_joined: '2023-05-15T10:00:00Z',
      last_login: '2025-01-08T11:20:00Z',
      is_active: true,
      cases_reported: 0,
      cases_assigned: 15,
      cases_solved: 11,
      cases_in_progress: 4
    },
    {
      id: 7,
      email: 'david.brown@example.com',
      first_name: 'David',
      last_name: 'Brown',
      role: 'victim',
      date_joined: '2024-11-05T15:30:00Z',
      last_login: '2025-01-08T10:15:00Z',
      is_active: true,
      cases_reported: 1,
      cases_resolved: 0,
      cases_pending: 1
    },
    {
      id: 8,
      email: 'lisa.anderson@example.com',
      first_name: 'Lisa',
      last_name: 'Anderson',
      role: 'victim',
      date_joined: '2024-04-12T09:45:00Z',
      last_login: '2025-01-03T14:30:00Z',
      is_active: true,
      cases_reported: 4,
      cases_resolved: 3,
      cases_pending: 1
    },
    {
      id: 9,
      email: 'james.wilson@cybercrime.gov',
      first_name: 'James',
      last_name: 'Wilson',
      role: 'investigator',
      date_joined: '2023-07-08T08:30:00Z',
      last_login: '2025-01-08T13:00:00Z',
      is_active: true,
      cases_reported: 0,
      cases_assigned: 18,
      cases_solved: 14,
      cases_in_progress: 4
    },
    {
      id: 10,
      email: 'robert.taylor@example.com',
      first_name: 'Robert',
      last_name: 'Taylor',
      role: 'victim',
      date_joined: '2024-10-20T12:00:00Z',
      last_login: '2025-01-07T16:45:00Z',
      is_active: false,
      cases_reported: 2,
      cases_resolved: 2,
      cases_pending: 0
    },
    {
      id: 11,
      email: 'emily.parker@cybercrime.gov',
      first_name: 'Emily',
      last_name: 'Parker',
      role: 'investigator',
      date_joined: '2023-09-25T09:15:00Z',
      last_login: '2025-01-08T14:50:00Z',
      is_active: true,
      cases_reported: 0,
      cases_assigned: 10,
      cases_solved: 7,
      cases_in_progress: 3
    },
    {
      id: 12,
      email: 'jennifer.white@example.com',
      first_name: 'Jennifer',
      last_name: 'White',
      role: 'victim',
      date_joined: '2024-12-01T10:30:00Z',
      last_login: '2025-01-08T09:20:00Z',
      is_active: true,
      cases_reported: 1,
      cases_resolved: 0,
      cases_pending: 1
    }
  ];

  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);

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
                              {new Date(user.last_login).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Activity Stats */}
                        {user.role === 'victim' && (
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400">Cases Reported:</span>
                              <span className="text-blue-400 font-semibold">{user.cases_reported}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-gray-400">Resolved:</span>
                              <span className="text-green-400 font-semibold">{user.cases_resolved}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-400">Pending:</span>
                              <span className="text-yellow-400 font-semibold">{user.cases_pending}</span>
                            </div>
                          </div>
                        )}

                        {user.role === 'investigator' && (
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-400">Cases Assigned:</span>
                              <span className="text-purple-400 font-semibold">{user.cases_assigned}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-gray-400">Solved:</span>
                              <span className="text-green-400 font-semibold">{user.cases_solved}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400">In Progress:</span>
                              <span className="text-blue-400 font-semibold">{user.cases_in_progress}</span>
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
                              <div className="mt-1 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                {getRoleBadge(user.role)}
                              </div>
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
                                {formatDate(user.last_login)}
                              </p>
                            </div>

                            {/* Activity Statistics - Victims */}
                            {user.role === 'victim' && (
                              <>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Reported</label>
                                  <p className="mt-1 text-blue-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_reported}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Resolved</label>
                                  <p className="mt-1 text-green-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_resolved}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Pending</label>
                                  <p className="mt-1 text-yellow-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_pending}
                                  </p>
                                </div>
                              </>
                            )}

                            {/* Activity Statistics - Investigators */}
                            {user.role === 'investigator' && (
                              <>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Assigned</label>
                                  <p className="mt-1 text-purple-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_assigned}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases Solved</label>
                                  <p className="mt-1 text-green-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_solved}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Cases In Progress</label>
                                  <p className="mt-1 text-blue-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_in_progress}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 font-medium">Success Rate</label>
                                  <p className="mt-1 text-cyan-400 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-semibold">
                                    {user.cases_assigned > 0 
                                      ? Math.round((user.cases_solved / user.cases_assigned) * 100)
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
