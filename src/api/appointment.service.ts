import axios, { AxiosError } from 'axios'
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './types/api.requests.types';

export const createAppointment = async (appointment: CreateAppointmentDto) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/appointment`, appointment);
      return response.data;
    } catch (error: unknown) {
        if(error instanceof AxiosError){
            return error!.response!.data
        }
      
      
    }
    
};

export const getAppointmentsByOwnerId = async (ownerId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/byOwner?ownerId=` + ownerId);
      return response.data.message;
    } catch (error) {
      console.error("Error during fetching appointments:", error);
      throw error;
    }
    
};

export const getAppointmentsByClinicId = async (clinicId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/byClinic?clinicId=` + clinicId);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching appointments:", error);
    throw error;
  }
  
};

export const updateAppointmentStatus = async (updateAppointment: UpdateAppointmentStatusDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/appointment`, updateAppointment);
    return response.data.message;
  } catch (error) {
    console.error("Error during updating appointment status:", error);
    throw error;
  }
  
};