import axios from 'axios'

export const getVetsByClinicId = async (clinicId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/veterinarian/` + clinicId);
      return response.data.message;
    } catch (error) {
      console.error("Error during fetching veterinarians:", error);
      throw error;
    }
    
  };