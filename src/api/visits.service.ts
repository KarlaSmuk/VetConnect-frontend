import axios from 'axios'
import { CreateVisitDto } from './types/api.requests.types';

export const createVisit = async (petId: string, vetId: string, visitData: CreateVisitDto) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/visit?petId=` + petId + `&vetId=` + vetId, visitData);
      return response.data.message;
    } catch (error) {
      console.error("Error during fetching visits:", error);
      throw error;
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