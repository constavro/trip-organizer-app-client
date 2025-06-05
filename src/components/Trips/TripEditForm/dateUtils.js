// src/utils/dateUtils.js
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return ''; // Fallback for invalid date
    }
  };
  
  export const calculateStopEndDate = (startDateStr, numDays) => {
    if (!startDateStr || isNaN(parseInt(numDays)) || parseInt(numDays) < 1) return '';
    try {
      const date = new Date(startDateStr + 'T00:00:00Z'); // Treat as UTC
      date.setUTCDate(date.getUTCDate() + parseInt(numDays) - 1);
      return date.toISOString().split('T')[0];
    } catch (e) { return ''; }
  };
  
  export const getNextDay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00Z');
      date.setUTCDate(date.getUTCDate() + 1);
      return date.toISOString().split('T')[0];
    } catch (e) { return ''; }
  };
  
  export const getTotalDaysBetween = (startDateStr, endDateStr) => {
      if (!startDateStr || !endDateStr) return 0;
      try {
        const startDate = new Date(startDateStr + 'T00:00:00Z');
        const endDate = new Date(endDateStr + 'T00:00:00Z');
        if (endDate < startDate) return 0;
        const differenceInTime = endDate.getTime() - startDate.getTime();
        return Math.round(differenceInTime / (1000 * 3600 * 24)) + 1;
      } catch (e) { return 0;}
  };