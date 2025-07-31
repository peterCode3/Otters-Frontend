import apiClient from './apiClient';

export const fetchDeletedLeadsByClientId = async (page = 1, pageSize = 20) => {
  const res = await apiClient.get(`/deleted-leads?page=${page}&pageSize=${pageSize}`);
  return res.data;
};



export const restoreDeletedLead = async (id) => {
  const res = await apiClient.post(`/deleted-leads/restore/${id}`, {});
  return res.data;
};

export const deleteLeadPermanently = async (id) => {
  const response = await apiClient.delete(`/deleted-leads/${id}/permanent`);
  return response.data;
};
