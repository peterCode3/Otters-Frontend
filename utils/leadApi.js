import apiClient from './apiClient';

// Fetch all leads
export const fetchLeads = async () => {
  const { data } = await apiClient.get('/leads');
  return data;
};

export const fetchMyLeads = async (page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await apiClient.get('/leads/my_leads', { params });
  return res.data;
};

export const fetchLeadsTrend = async (range = '7d') => {
  const res = await apiClient.get(`/leads/trend?range=${range}`);
  return res.data;
};

export const getLeadStats = async () => {
  const { data } = await apiClient.get('/leads/trend');
  return {
    totalLeads: data.totalLeads,
    qualifiedLeads: data.qualifiedLeads,
  };
};

export const fetchManualReviewLeads = async (page = 1, pageSize = 8) => {
  const res = await apiClient.get('/leads/manual_review', { params: { page, pageSize } });
  return res.data;
};

export const fetchLeadTrendsByClientId = async (clientId = 'all', days = 28) => {
  const res = await apiClient.get('/leads/lead_quality_trends', { params: { clientId, days } });
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await apiClient.delete(`/leads/${id}/recycle`);
  return res.data;
};

export const fetchLeadByMeId = async (id) => {
  const res = await apiClient.get(`/leads/${id}`);
  return res.data;
};

export const fetchArchiveLeadByMeId = async (id) => {
  const res = await apiClient.get(`/leads/archived/${id}`);
  return res.data;
};

export const fetchLeadByClientId = async (id, page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await apiClient.get(`/leads/client/${id}`, { params });
  return res.data;
};

export const fetchLeadById = async (id) => {
  const { data } = await apiClient.get(`/leads/${id}`);
  return data;
};

export const archiveLead = async (leadId) => {
  const { data } = await apiClient.post(`/archive_lead/${leadId}`);
  return data;
};

export const addLeadComment = async ({ lead_id, comment_type, leads_comment }) => {
  const { data } = await apiClient.post('/comments/me', {
    lead_id,
    comment_type,
    leads_comment,
  });
  return data;
};

export const applyTagsToLeads = async (leadIds, tags) => {
  const results = await Promise.all(
    leadIds.map((id) =>
      apiClient.put(`/leads/${id}`, { tags })
    )
  );
  return results;
};

export const fetchUnqualifiedLeadsSummary = async (clientId = 'all') => {
  const res = await apiClient.get('/leads/unqualified-summary', { params: { clientId } });
  const { totalUnqualifiedLeads, reasons } = res.data;
  const colorMap = {
    'Budget too low': '--unqualified-budget',
    'Wrong region': '--unqualified-region',
    'Vague intent': '--unqualified-intent',
    'Other': '--unqualified-other',
  };
  const reasonsWithColors = reasons.map((r) => ({
    ...r,
    percent: r.percentage,
    colorVar: colorMap[r.label] || '--unqualified-other',
  }));
  return {
    total: totalUnqualifiedLeads,
    reasons: reasonsWithColors,
  };
};

export const fetchUserLeadsTrend = async (range = '7d') => {
  const res = await apiClient.get('/leads/user/trend', { params: { range } });
  return res.data;
};

export const getUserLeadQualityByClientId = async () => {
  const res = await apiClient.get('/leads/lead_user_quality_trends');
  return res.data;
};

export const getUserLeads = async (pageSize = 100) => {
  const res = await apiClient.get('/leads/user', { params: { pageSize } });
  return res.data;
};

// utils/leadApi.js
export const getUserLeadQualityOverview = async (days = 30) => {
  const res = await apiClient.get('/leads/user/lead-quality-overview', {
    params: { days },
  });
  return res.data;
};

export const getQualifiedLeads = async () => {
  const res = await apiClient.get('/leads/me/qualified');
  return res.data;
};

export const getMeLeads = async () => {
  const res = await apiClient.get('/leads/me/leads');
  return res.data;
};

export const updateLeadById = async (id, data) => {
  const res = await apiClient.put(`/leads/${id}`, data);
  return res.data;
};