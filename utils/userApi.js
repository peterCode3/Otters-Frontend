import axios from 'axios';

const user = process.env.NEXT_PUBLIC_API_URL || "";

// Get current user
export async function getCurrentUser() {
  const { data } = await axios.get(`${user}/user/me`, { withCredentials: true });
  return data;
}


export const getAllUsers = async () => {
  const res = await axios.get(`${user}/user/all_user`, { withCredentials: true });
  return res.data.users || res.data;
};

// ✅ Delete user by ID
export const deleteUserById = async (id) => {
  await axios.delete(`${user}/user`, {
    data: { id },
    withCredentials: true,
  });
};

// ✅ Update user by ID
export const updateUserById = async (id, data) => {
  const res = await axios.put(`${user}/user/${id}`, data, { withCredentials: true });
  return res.data;
};

// Update current user
export async function updateCurrentUser(form) {
  const { data } = await axios.put(`${user}/user/me`, { withCredentials: true }, form);
  return data;
}


export const fetchUserById = async (id) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data;
};


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