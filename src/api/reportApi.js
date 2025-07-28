// import axios from 'axios';

// // Get base URL from environment variables
// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ;

// // Create axios instance with base configuration
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // 30 seconds timeout for report generation
//   withCredentials: true,
// });

// // Add request interceptor to include auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid, redirect to login
//       localStorage.removeItem('adminToken');
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Dashboard Analytics API
// export const dashboardApi = {
//   /**
//    * Get dashboard analytics data
//    * @param {string} period - Time period (1d, 7d, 30d, 90d, 1y)
//    * @returns {Promise} Dashboard data
//    */
//   getDashboardData: async (period = '0d') => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/dashboard', {
//         params: { period }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error;
//     }
//   }
// };

// // Report Generation API
// export const reportApi = {
//   /**
//    * Generate standard report
//    * @param {Object} params - Report parameters
//    * @param {string} params.reportType - Type of report
//    * @param {string} params.startDate - Start date ISO string
//    * @param {string} params.endDate - End date ISO string
//    * @param {string} params.branchId - Branch ID (optional)
//    * @param {string} params.format - Export format (json, csv)
//    * @returns {Promise} Report data
//    */
//   generateReport: async (params) => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/generate', {
//         params: {
//           reportType: params.reportType || 'comprehensive',
//           startDate: params.startDate,
//           endDate: params.endDate,
//           branchId: params.branchId || '',
//           format: params.format || 'json'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error generating report:', error);
//       throw error;
//     }
//   },

//   /**
//    * Generate AI-powered report
//    * @param {Object} params - Report parameters
//    * @returns {Promise} AI report data
//    */
//   generateAIReport: async (params) => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/ai-report', {
//         params: {
//           reportType: params.reportType || 'comprehensive',
//           dateRange: params.dateRange ? JSON.stringify(params.dateRange) : undefined,
//           branchId: params.branchId || 'all'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error generating AI report:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get AI insights for existing report data
//    * @param {Object} reportData - Report data to analyze
//    * @param {string} reportType - Type of report
//    * @returns {Promise} AI insights
//    */
//   getAIInsights: async (reportData, reportType = 'comprehensive') => {
//     try {
//       const response = await apiClient.post('/api/admin/reports/ai-insights', {
//         reportData,
//         reportType
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error getting AI insights:', error);
//       throw error;
//     }
//   },

//   /**
//    * Export report as PDF
//    * @param {Object} params - Export parameters
//    * @returns {Promise} PDF blob
//    */
//   exportPDF: async (params) => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/export/pdf', {
//         params: {
//           reportType: params.reportType || 'comprehensive',
//           dateRange: params.dateRange ? JSON.stringify(params.dateRange) : undefined,
//           branchId: params.branchId || 'all',
//           includeAI: params.includeAI || 'false'
//         },
//         responseType: 'blob'
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting PDF:', error);
//       throw error;
//     }
//   },

//   /**
//    * Export report as CSV
//    * @param {Object} params - Export parameters
//    * @returns {Promise} CSV blob
//    */
//   exportCSV: async (params) => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/export/csv', {
//         params: {
//           reportType: params.reportType || 'comprehensive',
//           dateRange: params.dateRange ? JSON.stringify(params.dateRange) : undefined,
//           branchId: params.branchId || 'all',
//           includeAI: params.includeAI || 'false'
//         },
//         responseType: 'blob'
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting CSV:', error);
//       throw error;
//     }
//   },

//   /**
//    * Export specific data as CSV
//    * @param {string} dataType - Type of data to export
//    * @param {Object} params - Export parameters
//    * @returns {Promise} CSV blob
//    */
//   exportDataCSV: async (dataType, params = {}) => {
//     try {
//       const response = await apiClient.get(`/api/admin/reports/export/data/${dataType}`, {
//         params: {
//           fields: params.fields,
//           limit: params.limit || 1000,
//           filters: params.filters ? JSON.stringify(params.filters) : undefined
//         },
//         responseType: 'blob'
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting data CSV:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get available export options
//    * @returns {Promise} Export options
//    */
//   getExportOptions: async () => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/export/options');
//       return response.data;
//     } catch (error) {
//       console.error('Error getting export options:', error);
//       throw error;
//     }
//   },

//   /**
//    * Download report in specified format
//    * @param {Object} params - Download parameters
//    * @returns {Promise} Blob data for download
//    */
//   downloadReport: async (params) => {
//     try {
//       const response = await apiClient.get('/api/admin/reports/generate', {
//         params: {
//           reportType: params.reportType || 'comprehensive',
//           startDate: params.startDate,
//           endDate: params.endDate,
//           branchId: params.branchId || '',
//           format: params.format || 'json'
//         },
//         responseType: 'blob' // Important for file downloads
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error downloading report:', error);
//       throw error;
//     }
//   }
// };

// // Branch API
// export const branchApi = {
//   /**
//    * Get all branches
//    * @returns {Promise} Branches data
//    */
//   getAllBranches: async () => {
//     try {
//       const response = await apiClient.get('/api/admin/branches');
//       return {
//         status: "success",
//         data: response.data.branches || []
//       };
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       throw error;
//     }
//   }
// };

// // Export the configured axios instance for custom calls
// export { apiClient };

// // Export default configuration
// export default {
//   dashboardApi,
//   reportApi,
//   branchApi,
//   apiClient
// };



import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for report generation
  withCredentials: true,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard Analytics API
export const dashboardApi = {
  /**
   * Get dashboard analytics data
   * @param {string} period - Time period (1d, 7d, 30d, 90d, 1y)
   * @returns {Promise} Dashboard data
   */
  getDashboardData: async (period = '0d') => {
    try {
      const response = await apiClient.get('/api/admin/reports/dashboard', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

// Report Generation API
export const reportApi = {
  /**
   * Generate standard report
   * @param {Object} params - Report parameters
   * @param {string} params.reportType - Type of report
   * @param {string} params.startDate - Start date ISO string
   * @param {string} params.endDate - End date ISO string
   * @param {string} params.branchId - Branch ID (optional)
   * @param {string} params.reportPart - Report part (optional)
   * @param {string} params.format - Export format (json, csv)
   * @returns {Promise} Report data or CSV blob
   */
  generateReport: async (params) => {
    try {
      const response = await apiClient.get('/api/admin/reports/generate', {
        params: {
          reportType: params.reportType || 'comprehensive',
          startDate: params.startDate,
          endDate: params.endDate,
          branchId: params.branchId || 'all',
          reportPart: params.reportPart || 'all',
          format: params.format || 'json'
        },
        responseType: params.format === 'csv' ? 'blob' : 'json'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  /**
   * Export comprehensive report as CSV (simplified endpoint)
   * @returns {Promise} CSV blob
   */
  exportComprehensiveCSV: async () => {
    try {
      const response = await apiClient.get('/api/admin/reports/export/comprehensive-csv', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting comprehensive CSV:', error);
      throw error;
    }
  }
};

// Branch API
export const branchApi = {
  /**
   * Get all branches
   * @returns {Promise} Branches data
   */
  getAllBranches: async () => {
    try {
      const response = await apiClient.get('/api/admin/branches');
      return {
        status: "success",
        data: response.data.branches || []
      };
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }
};

// AI Insights API
export const aiApi = {
  /**
   * Get business metrics for AI analysis
   * @param {Object} params - Parameters for metrics
   * @param {string} params.dateRange - JSON string of date range
   * @param {string} params.branchId - Branch ID or 'all'
   * @returns {Promise} Business metrics data
   */
  getBusinessMetrics: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/ai/metrics', {
        params: {
          dateRange: params.dateRange || JSON.stringify({
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          }),
          branchId: params.branchId || 'all'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      throw error;
    }
  },

  /**
   * Generate AI-powered business report
   * @param {Object} params - Report parameters
   * @param {string} params.reportType - Type of report (comprehensive, performance, etc.)
   * @param {string} params.dateRange - JSON string of date range
   * @param {string} params.branchId - Branch ID or 'all'
   * @returns {Promise} AI-generated insights and recommendations
   */
  generateAIReport: async (params = {}) => {
    try {
      const response = await apiClient.post('/api/admin/ai/generate-report', {
        reportType: params.reportType || 'comprehensive',
        dateRange: params.dateRange || JSON.stringify({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        }),
        branchId: params.branchId || 'all'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating AI report:', error);
      throw error;
    }
  },

  /**
   * Get AI insights for custom data
   * @param {Object} params - Parameters for insights
   * @param {Object} params.reportData - Custom data to analyze
   * @param {string} params.reportType - Type of analysis
   * @returns {Promise} AI insights and recommendations
   */
  getAIInsights: async (params = {}) => {
    try {
      const response = await apiClient.post('/api/admin/ai/insights', {
        reportData: params.reportData,
        reportType: params.reportType || 'comprehensive'
      });
      return response.data;
    } catch (error) {
      console.error('Error getting AI insights:', error);
      throw error;
    }
  },

  /**
   * Get performance analysis data
   * @param {Object} params - Parameters for performance analysis
   * @param {string} params.analysisType - Type of analysis
   * @param {string} params.dateRange - JSON string of date range
   * @param {string} params.branchId - Branch ID or 'all'
   * @returns {Promise} Performance analysis data
   */
  getPerformanceAnalysis: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/ai/performance', {
        params: {
          analysisType: params.analysisType || 'comprehensive',
          dateRange: params.dateRange || JSON.stringify({
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          }),
          branchId: params.branchId || 'all'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting performance analysis:', error);
      throw error;
    }
  }
};

// Export the configured axios instance for custom calls
export { apiClient };

// Export default configuration
export default {
  dashboardApi,
  reportApi,
  branchApi,
  aiApi,
  apiClient
};