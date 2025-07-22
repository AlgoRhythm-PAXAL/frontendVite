// // pages/Notifications.js
// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../contexts/AuthContext';
// import axios from 'axios';


// const Notifications = () => {
//   const { user } = useContext(AuthContext);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, [page]);

//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/notifications?page=${page}&limit=20`,
//          { withCredentials: true }
//       );
       
 
//       setNotifications(prev => [...prev, ...response.data]);
//       setHasMore(response.data.length === 20);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//  const markAsRead = async (id) => {
//   try {
//     const response = await axios.post(
//       `http://localhost:8000/api/notifications/mark-as-read/${id}`,
//       {},
//       { withCredentials: true }
//     );
    
//     setNotifications(notifications.map(n => 
//       n._id === id ? response.data.notification : n
//     ));
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//   }
// };

// const markAllAsRead = async () => {
//   try {
//     const response = await axios.post(
//       'http://localhost:8000/api/notifications/mark-all-read',
//       {},
//       { withCredentials: true }
//     );
    
//     setNotifications(response.data.notifications);
//   } catch (error) {
//     console.error('Error marking all notifications as read:', error);
//   }
// };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
//         <button
//           onClick={markAllAsRead}
//           className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
//           disabled={notifications.filter(n => !n.isRead).length === 0}
//         >
//           Mark All as Read
//         </button>
//       </div>

//       {loading && notifications.length === 0 ? (
//         <div className="text-center py-8">Loading notifications...</div>
//       ) : notifications.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">No notifications found</div>
//       ) : (
//         <ul className="space-y-2">
//           {notifications.map(notification => (
//             <li
//               key={notification._id}
//               className={`p-4 rounded-lg ${!notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'}`}
//               onClick={() => !notification.isRead && markAsRead(notification._id)}
//             >
//               <div className="flex justify-between">
//                 <p className="text-gray-800">{notification.message}</p>
//                 {!notification.isRead && (
//                   <span className="text-xs text-blue-500">New</span>
//                 )}
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 {formatDate(notification.createdAt)}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}

//       {hasMore && !loading && (
//         <div className="text-center mt-4">
//           <button
//             onClick={() => setPage(p => p + 1)}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//           >
//             Load More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;


import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  FiBell, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiInbox,
  FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notifications?page=${page}&limit=10`,
        { withCredentials: true }
      );
      
      setNotifications(prev => [...prev, ...response.data]);
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
      const response = await axios.post(
        'http://localhost:8000/api/notifications/mark-all-read',
        {},
        { withCredentials: true }
      );
      
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const refreshNotifications = () => {
    setIsRefreshing(true);
    setPage(1);
    setNotifications([]);
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FiBell className="w-6 h-6 text-[#1f818c] mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-[#1f818c] rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={refreshNotifications}
            className="p-2 text-gray-500 hover:text-[#1f818c] transition-colors"
            disabled={isRefreshing}
          >
            <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#e6f4f5] text-[#1f818c] rounded-lg hover:bg-[#d0e8ea] transition-colors flex items-center"
            disabled={unreadCount === 0}
          >
            <FiCheckCircle className="mr-2" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading && notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiInbox className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No notifications yet</h3>
          <p className="text-gray-400 mt-1">We'll notify you when something arrives</p>
        </div>
      ) : (
        <motion.ul className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.li
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-lg overflow-hidden ${!notification.isRead ? 'bg-[#f0f9fa] border-l-4 border-[#1f818c]' : 'bg-white'}`}
              >
                <div 
                  className={`p-4 cursor-pointer`}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification._id);
                    setExpandedNotification(expandedNotification === notification._id ? null : notification._id);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#1f818c] mr-3"></div>
                        )}
                        <p className={`${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-5">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-[#1f818c] ml-2">
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
                        <div className="mt-3 flex justify-end">
                          <button 
                            className="text-xs text-[#1f818c] hover:text-[#16626b] font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add action for notification (like viewing related item)
                            }}
                          >
                            View details →
                          </button>
                        </div>
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
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 bg-white text-[#1f818c] border border-[#1f818c] rounded-lg hover:bg-[#f0f9fa] transition-colors"
          >
            Load more notifications
          </button>
        </div>
      )}

      {/* Empty state for no more notifications */}
      {!hasMore && notifications.length > 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          You've reached the end of your notifications
        </div>
      )}
    </div>
  );
};

export default Notifications;