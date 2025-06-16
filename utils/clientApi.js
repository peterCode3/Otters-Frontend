import axios from 'axios';
const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchClients = async () => {
  const res = await axios.get(`${API}/user/stats`, { withCredentials: true });
  console.log("Fetched clients:", res.data);
  return res.data;
}