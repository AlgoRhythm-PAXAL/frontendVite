export const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";



  
export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '-';
    }
  };