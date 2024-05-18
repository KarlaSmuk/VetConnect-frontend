import axios from 'axios'

export const getClinics = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic`);
    return response.data.message;
};

export const getClinicById = async (id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic/` + id);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching clinic:", error);
    throw error;
  }

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

export const updateClinicInfo = async (clinicData: UpdateClinicInfoDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic`, clinicData);
    return response.data;
  } catch (error) {
    console.error("Error during updating clinic info:", error);
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

export const updateWorkingHours = async (workingHoursClinic: UpdateWorkingHoursDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/hours`, workingHoursClinic);
    return response.data;
  } catch (error) {
    console.error("Error during updating clinic's working hours:", error);
    throw error;
  }

};