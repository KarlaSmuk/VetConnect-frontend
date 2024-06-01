import axios, { AxiosError } from 'axios'
import { CreateAppointmentDto } from './types/api.requests.types';

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

export const getVisitsByPetId = async (petId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit/` + petId);
      return response.data.message;
    } catch (error) {
      console.error("Error during fetching visits:", error);
      throw error;
    }
    
};