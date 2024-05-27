import axios from 'axios'
import { CreateClinicDto, CreateSupplyDto, CreateTreatmentDto, UpdateClinicInfoDto, UpdateWorkingHoursDto } from './types/api.requests.types';

export const getClinics = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic`);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching clinic:", error);
    throw error;
  }
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
    console.error("Error during creating clinic:", error);
    throw error;
  }

};

export const updateWorkingHours = async (workingHoursClinic: UpdateWorkingHoursDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/hours`, workingHoursClinic);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error during updating clinic's working hours:", error);
    throw error;
  }

};

//supplies
export const getSuppliesByClinicId = async (clinicId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic/supply/` + clinicId);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching supplies:", error);
    throw error;
  }
}

export const createSupply = async (clinicId: string, supplyData: CreateSupplyDto) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clinic/supply/` + clinicId, supplyData);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching supplies:", error);
    throw error;
  }
}

export const deleteSupply = async (supplyId: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/clinic/supply/` + supplyId);
    return response.data.message;
  } catch (error) {
    console.error("Error during deleting supply:", error);
    throw error;
  }
}

export const updateSupply = async (supplyId: string, stockQuantity: number) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/supply/price/` + supplyId + '?stockQuantity=' + stockQuantity);
    return response.data.message;
  } catch (error) {
    console.error("Error during updating supply:", error);
    throw error;
  }
}

export const updateSupplyDescription = async (supplyId: string, description: string) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/supply/description/` + supplyId + '?description=' + description);
    return response.data.message;
  } catch (error) {
    console.error("Error during updating supply:", error);
    throw error;
  }
}

//treatments

export const getTreatmentsByClinicId = async (clinicId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clinic/treatment/` + clinicId);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching treatments:", error);
    throw error;
  }
}

export const createTreatment = async (clinicId: string, treatmentData: CreateTreatmentDto) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clinic/treatment/` + clinicId, treatmentData);
    return response.data.message;
  } catch (error) {
    console.error("Error during creating treatment:", error);
    throw error;
  }
}

export const deleteTreatment = async (treatmentId: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/clinic/treatment/` + treatmentId);
    return response.data.message;
  } catch (error) {
    console.error("Error during deleting treatment:", error);
    throw error;
  }
}

export const updateTreatment = async (treatmentId: string, price: number) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/treatment/price/` + treatmentId + '?price=' + price);
    return response.data.message;
  } catch (error) {
    console.error("Error during updating treatment:", error);
    throw error;
  }
}

export const updateTreatmentDescription = async (treatmentId: string, description: string) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/clinic/treatment/description/` + treatmentId + '?description=' + description);
    return response.data.message;
  } catch (error) {
    console.error("Error during updating treatment:", error);
    throw error;
  }
}