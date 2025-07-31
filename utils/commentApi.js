import apiClient from './apiClient';

export const fetchCommentsByLeadId = async (leadId) => {
  const res = await apiClient.get(`/comments/${leadId}`);
  return res.data;
};

export const postCommentForMe = async ({ lead_id, leads_comment }) => {
  const res = await apiClient.post('/comments/me', { lead_id, leads_comment });
  return res.data;
};

export const updateComment = async (commentId, payload) => {
  const res = await apiClient.put(`/comments/${commentId}`, payload);
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await apiClient.delete(`/comments/${commentId}`);
  return res.data;
};
