

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  FiBell, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiInbox,
  FiRefreshCw,
  FiFilter,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notifications?page=${page}&limit=10&filter=${filter}`,
        { withCredentials: true }
      );
      
      setNotifications(prev => page === 1 ? response.data : [...prev, ...response.data]);
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/notifications/mark-as-read/${id}`,
        {},
        { withCredentials: true }
      );
      
      setNotifications(notifications.map(n => 
        n._id === id ? response.data.notification : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/notifications/mark-all-read',
        {},
        { withCredentials: true }
      );
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const refreshNotifications = () => {
    setIsRefreshing(true);
    setPage(1);
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top curve */}
      <div className="absolute top-0 left-0 w-full rotate-180">
        <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="topToBottomGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f818c" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <path
            fill="url(#topToBottomGradient)"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main content container */}
      <div className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header with Back Button */}
          <div className="flex items-center p-6 border-b border-gray-200">
            <button 
              onClick={() => navigate('/')}
              className="mr-4 p-2 text-gray-500 hover:text-[#1f818c] hover:bg-gray-100 rounded-full transition-colors border border-gray-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-1">
              <div className="flex items-center">
                <FiBell className="w-6 h-6 text-[#1f818c] mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-[#1f818c] rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiFilter className="mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700 capitalize">{filter}</span>
                  </button>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-100"
                      >
                        <div className="p-2 space-y-1">
                          {['all', 'unread', 'read'].map((f) => (
                            <button
                              key={f}
                              onClick={() => {
                                setFilter(f);
                                setShowFilters(false);
                                setPage(1);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                filter === f 
                                  ? 'bg-[#1f818c] text-white' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button
                  onClick={refreshNotifications}
                  className="p-2 text-gray-500 hover:text-[#1f818c] transition-colors bg-white border border-black rounded-lg"
                  disabled={isRefreshing}
                >
                  <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 bg-[#e6f4f5] text-[#1f818c] rounded-lg hover:bg-[#d0e8ea] transition-colors border border-[#1f818c]"
                  disabled={unreadCount === 0}
                >
                  <FiCheckCircle className="mr-2" />
                  <span className="text-sm">Mark all read</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-pulse flex flex-col items-center space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full bg-gray-100 rounded-lg p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl"
              >
                <FiInbox className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-500">No notifications found</h3>
                <p className="text-gray-400 mt-1">
                  {filter === 'all' 
                    ? "You don't have any notifications yet" 
                    : filter === 'unread' 
                      ? "You've read all your notifications" 
                      : "No read notifications"}
                </p>
              </motion.div>
            ) : (
              <motion.ul className="space-y-4">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg overflow-hidden border border-[#1f818c] ${
                        !notification.isRead 
                          ? 'bg-gradient-to-r from-[#f0f9fa] to-white' 
                          : 'bg-white'
                      }`}
                    >
                      <div 
                        className={`p-4 cursor-pointer`}
                        onClick={() => {
                          if (!notification.isRead) markAsRead(notification._id);
                          setExpandedNotification(expandedNotification === notification._id ? null : notification._id);
                        }}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start">
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-[#1f818c] mt-2 mr-3 flex-shrink-0"></div>
                              )}
                              <div className="overflow-hidden">
                                <p className={`text-lg ${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-[#1f818c] ml-2 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedNotification(expandedNotification === notification._id ? null : notification._id);
                            }}
                          >
                            {expandedNotification === notification._id ? (
                              <FiChevronUp className="w-5 h-5" />
                            ) : (
                              <FiChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedNotification === notification._id && (
                          <motion.div
                            layout
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100">
                              <div className="pt-3">
                                {notification.details || 'No additional details available'}
                              </div>
                              {notification.actionUrl && (
                                <div className="mt-3 flex justify-end">
                                  <a
                                    href={notification.actionUrl}
                                    className="text-xs px-3 py-1.5 bg-[#1f818c] text-white rounded-md hover:bg-[#16626b] font-medium transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View details
                                  </a>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {/* Load More Button */}
            {hasMore && !loading && filteredNotifications.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-6"
              >
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2 bg-white text-[#1f818c] border border-[#1f818c] rounded-lg hover:bg-[#f0f9fa] transition-colors"
                >
                  Load more notifications
                </button>
              </motion.div>
            )}

            {/* Empty state for no more notifications */}
            {!hasMore && filteredNotifications.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 text-gray-400 text-sm"
              >
                You've reached the end of your notifications
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;