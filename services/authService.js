import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL ;
console.log("API URL:", API);
// Auth APIs
export const loginUser = (payload) => axios.post(`${API}/auth/login`, payload, { withCredentials: true });
export const ForgetPassword = (payload) => axios.post(`${API}/auth/forget_password`, payload);
export const ResetPassword = (payload) => axios.post(`${API}/auth/reset_password_by_token`, payload);
export const signupUser = (payload) => axios.post(`${API}/auth/signup`, payload);

// Role APIs
export const createRole = (payload) => axios.post(`${API}/role`, payload, { withCredentials: true });
export const getRoles = () => axios.get(`${API}/role`, { withCredentials: true });
export const updateRole = (id, payload) => axios.put(`${API}/role/${id}`, payload, { withCredentials: true });
export const deleteRole = (id) => axios.delete(`${API}/role/${id}`, { withCredentials: true });
export const assignRole = (payload) => axios.post(`${API}/role/assign`, payload, { withCredentials: true });

// User APIs (for assigning roles)
export const getUsers = () => axios.get(`${API}/user/all_user`, { withCredentials: true });