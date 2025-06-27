import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const fetchCommentsByLeadId = async (leadId) => {
  const res = await axios.get(`${API_BASE}/comments/${leadId}`);
  return res.data;
};

export const postCommentForMe = async ({ lead_id, leads_comment }) => {
  const res = await axios.post(`${API_BASE}/comments/me`, {
    lead_id,
    leads_comment,
  }, { withCredentials: true });
  return res.data;
};

export const updateComment = async (commentId, payload) => {
  const res = await axios.put(`${API_BASE}/comments/${commentId}`, payload);
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await axios.delete(`${API_BASE}/comments/${commentId}`);
  return res.data;
};
