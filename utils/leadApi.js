import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
export const fetchLeads = async () => {
  const { data } = await axios.get(`${API}/leads`, { withCredentials: true });
  return data;
};



export const fetchLeadsTrend = async () => {
  const res = await axios.get(`${API}/leads/trend`, { withCredentials: true });
  return res.data;
};


export const fetchManualReviewLeads = async (page = 1, pageSize = 8) => {
  const res = await axios.get(`${API}/leads/manual_review?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
  return res.data;
};


export const fetchLeadQualityTrends = async () => {
  const res = await axios.get(`${API}/leads/lead_quality_trends`, { withCredentials: true });
  return res.data;
};


// Delete a lead by ID
export const deleteLead = async (id) => {
  const res = await axios.delete(`${API}/leads/${id}`, { withCredentials: true });
  return res.data;
};

// View a single lead by ID
export const fetchLeadById = async (id) => {
  const res = await axios.get(`${API}/leads/${id}`, { withCredentials: true });
  return res.data;
};


// View a all lead by client ID
export const fetchLeadByClientId = async (id, page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await axios.get(`${API}/leads/client/${id}`, { params, withCredentials: true });
  return res.data;
};


export const fetchAllLeads = fetchLeads;