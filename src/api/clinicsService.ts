import axios from 'axios'

export const getClinics = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic`);
    return response.data.message;
  };