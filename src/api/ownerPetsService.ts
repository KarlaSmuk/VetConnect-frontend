import axios from 'axios'

export const getOwners = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/owner/getOwners`);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching owners:", error);
    throw error;
  }
  
};