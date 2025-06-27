import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchArchiveLeadByClientId = async (id, page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await axios.get(`${API}/archive_lead/client/${id}`, { params, withCredentials: true });
  return res.data;
};

export const archiveLead = (id) =>
  axios.post(`${API}/archive_lead/${id}`, {}, { withCredentials: true });

export const deleteArchivedLead = (leadId) =>
  axios.delete(`${API}/archive_lead/by-lead/${leadId}`, { withCredentials: true });

export const fetchLeadByMeId = (id) =>
  axios.get(`${API}/lead/me/${id}`, { withCredentials: true }).then(res => res.data);

export const fetchArchiveLeadByMeId = (id) =>
  axios.get(`${API}/archive_lead/${id}`, { withCredentials: true }).then(res => res.data);
