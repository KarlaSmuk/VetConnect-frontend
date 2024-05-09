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

export const createOwner = async (ownerData: CreateOwnerDto) => {
  try {
    console.log(ownerData)
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, ownerData);
    return response.data.message;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }
  
};