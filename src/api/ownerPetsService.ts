import axios from 'axios'

export const getOwners = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/owners`);
    return response.data.message;
  };