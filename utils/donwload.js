import apiClient from './apiClient';

export const downloadWeeklySummary = async () => {
  try {
    const res = await apiClient.get('/weekly-summary/', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-summary.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ Error downloading summary:', error);
    throw error;
  }
};
