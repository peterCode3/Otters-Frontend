import axios from 'axios';

const user = process.env.NEXT_PUBLIC_API_URL || "";
import apiClient from './apiClient';


export async function getCurrentUser() {
  const { data } = await apiClient.get('/user/me');
  return data;
}

export const getAllUsers = async () => {
  const { data } = await apiClient.get('/user/all_user');
  return data.users || data;
};

export const getLastExportDate = async () => {
  const { data } = await apiClient.get('/user/export-meta');
  return data.lastExport;
};



export const deleteUserById = async (id) => {
  await apiClient.delete('/user', { data: { id } });
};

export const updateUserById = async (id, data) => {
  const res = await apiClient.put(`/user/${id}`, data);
  return res.data;
};

export async function updateCurrentUser(form) {
  const { data } = await apiClient.put('/user/me', form);
  return data;
}

export const fetchUserById = async (id) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
};

export async function deleteCurrentUser() {
  const { data } = await apiClient.delete('/user/me');
  return data;
}

export async function resetCurrentUserPassword(passwords) {
  const { data } = await apiClient.post('/user/me/reset-password', passwords);
  return data;
}

export const updateUserSettings = async (settings = {}) => {
  const { data } = await apiClient.patch('/user/settings', settings);
  return data;
};

