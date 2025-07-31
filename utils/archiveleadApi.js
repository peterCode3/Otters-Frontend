
import apiClient from './apiClient';


export const fetchArchiveLeadByClientId = async (id, page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await apiClient.get(`/archive_lead/client/${id}`, { params });
  return res.data;
};

export const archiveLead = (id) =>
  apiClient.post(`/archive_lead/${id}`, {});

export const deleteArchivedLead = (leadId) =>
  apiClient.delete(`/archive_lead/by-lead/${leadId}`);

export const fetchLeadByMeId = (id) =>
  apiClient.get(`/lead/me/${id}`).then(res => res.data);

export const fetchArchiveLeadByMeId = (id) =>
  apiClient.get(`/archive_lead/${id}`).then(res => res.data);