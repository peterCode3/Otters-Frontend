import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
export const fetchLeads = async () => {
  const { data } = await axios.get(`${API}/leads`, { withCredentials: true });
  return data;
};