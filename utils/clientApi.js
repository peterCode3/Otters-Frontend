import axios from 'axios';
const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchClients = async () => {
  const res = await axios.get(`${API}/user/stats`, { withCredentials: true });
  return res.data;
}



export const fetchClientsById = async (id) => {
  const res = await axios.get(`${API}/user/${id}`, { withCredentials: true });
  console.log("Client Data:", res.data);
  return res.data;
}


