import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;


export const fetchLeads = async () => {
  const { data } = await axios.get(`${API}/leads`, { withCredentials: true });
  return data;
};

export const fetchMyLeads = async (page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await axios.get(`${API}/leads/my_leads`, { params, withCredentials: true });
  return res.data;
};


export const fetchLeadsTrend = async (range = '7d') => {
  const res = await axios.get(`${API}/leads/trend?range=${range}`, { withCredentials: true });
  return res.data;
};



export const fetchManualReviewLeads = async (page = 1, pageSize = 8) => {
  const res = await axios.get(`${API}/leads/manual_review?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
  return res.data;
};


// export const fetchLeadQualityTrends = async () => {
//   const res = await axios.get(`${API}/leads/lead_quality_trends`, { withCredentials: true });
//   return res.data;
// };

export const fetchLeadTrendsByClientId = async (clientId = 'all', days = 28) => {
  const res = await axios.get(`${API}/leads/lead_quality_trends`, {
    params: {
      clientId,
      days,
    },
    withCredentials: true,
  });
  return res.data;
};


// Delete a lead by ID
export const deleteLead = async (id) => {
  const res = await axios.delete(`${API}/leads/${id}`, { withCredentials: true });
  return res.data;
};

// View a single lead by ID
export const fetchLeadByMeId = async (id) => {
  const res = await axios.get(`${API}/leads/${id}`, { withCredentials: true });
  return res.data;
};

export const fetchArchiveLeadByMeId = async (id) => {
  const res = await axios.get(`${API}/leads/archived/${id}`, { withCredentials: true });
  return res.data;
};



// View a all lead by client ID
export const fetchLeadByClientId = async (id, page = 1, pageSize = 5, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await axios.get(`${API}/leads/client/${id}`, { params, withCredentials: true });
  return res.data;
};


export async function fetchLeadById(id) {
  const { data } = await axios.get(`${API}/leads/${id}`, { withCredentials: true });
  return data;
}

export async function archiveLead(leadId) {
  const { data } = await axios.post(`${API}/archive_lead/${leadId}`, {}, { withCredentials: true });
  return data;
}

export async function addLeadComment({ lead_id, comment_type, leads_comment }) {
  const { data } = await axios.post(
    `${API}/leads/comments/me`,
    { lead_id, comment_type, leads_comment },
    { withCredentials: true }
  );
  return data;
}




// Apply tags to multiple leads
export const applyTagsToLeads = async (leadIds, tags) => {
  const results = await Promise.all(
    leadIds.map((id) =>
      axios.put(`${API}/leads/${id}`, { tags }, { withCredentials: true })
    )
  );
  return results;
};




export const fetchUnqualifiedLeadsSummary = async (clientId = 'all') => {
  const res = await axios.get(`${API}/leads/unqualified-summary`, {
    params: { clientId },
    withCredentials: true,
  });

  const { totalUnqualifiedLeads, reasons } = res.data;

  // Add CSS color variable names
  const colorMap = {
    'Budget too low': '--unqualified-budget',
    'Wrong region': '--unqualified-region',
    'Vague intent': '--unqualified-intent',
    'Other': '--unqualified-other',
  };

  const reasonsWithColors = reasons.map((r) => ({
    ...r,
    percent: r.percentage, // match your chart prop
    colorVar: colorMap[r.label] || '--unqualified-other',
  }));

  return {
    total: totalUnqualifiedLeads,
    reasons: reasonsWithColors,
  };
};




export const fetchAllLeads = fetchLeads;

