import axios from 'axios'

export const getClinics = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic`);
    return response.data.message;
};

export const createClinic = async (clinicData: CreateClinicDto) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clinic`, clinicData);
    return response.data;
  } catch (error) {
    console.error("Error during creating clinic:", error);
    throw error;
  }
  
};