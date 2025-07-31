const API = process.env.NEXT_PUBLIC_API_URL;

import apiClient from './apiClient';

export const fetchClients = async () => {
  const res = await apiClient.get(`/user/stats`);
  return res.data;
}



export const fetchClientsById = async (id) => {
  const res = await apiClient.get(`/user/${id}`);
  return res.data;
}


