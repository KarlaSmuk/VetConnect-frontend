import axios from 'axios'

export const getClinics = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic`);
    return response.data.message;
};

export const createClinic = async (clinicData: CreateClinicDto) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clinic`, clinicData);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error during creating clinic:", error);
    throw error;
  }
  
};

export const deleteClinic = async (clinicId: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/clinic/delete/` + clinicId);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};
