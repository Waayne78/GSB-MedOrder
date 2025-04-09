import axios from "axios";

const API_URL = "http://localhost:3006/api/commandes";

const getUserOrders = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export default { getUserOrders };