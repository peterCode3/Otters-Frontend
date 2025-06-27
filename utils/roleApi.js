// utils/roleApi.js
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL;


export const getAllRoles = async () => {
  const res = await axios.get(`${baseURL}/role`, { withCredentials: true });

  return res.data;
};

export const updateRoleById = async (id, data) => {
  const res = await axios.put(`${baseURL}/role/${id}`, data, { withCredentials: true });
  return res.data;
};

export const deleteRoleById = async (id) => {
  await axios.delete(`${baseURL}/role/${id}`, { withCredentials: true });
};
