import axios from 'axios';

const user = process.env.NEXT_PUBLIC_API_URL || "";

// Get current user
export async function getCurrentUser() {
  const { data } = await axios.get(`${user}/user/me`, { withCredentials: true });
  return data;
}

// Update current user
export async function updateCurrentUser(form) {
  const { data } = await axios.put(`${user}/user/me`, { withCredentials: true }, form);
  return data;
}

// Delete current user
export async function deleteCurrentUser() {
  const { data } = await axios.delete(`${user}/user/me`, { withCredentials: true });
  return data;
}

// Reset current user password
export async function resetCurrentUserPassword(passwords) {
  const { data } = await axios.post(`${user}/user/me/reset-password`, { withCredentials: true }, passwords);
  return data;
}