import axios from 'axios'
import { CreatePetDto, UpdatePetStatusDto } from './types/api.requests.types';

export const getOwners = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/owner/getOwners`);
    return response.data.message;
  } catch (error) {
    console.error("Error during fetching owners:", error);
    throw error;
  }
  
};

export const getPetsByOwnerId = async (ownerId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet?ownerId=` + ownerId);
    return response.data;
  } catch (error) {
    console.error("Error during fetching pets:", error);
    throw error;
  }
  
};

export const getBreedsBySpeciesId = async (speciesId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/breeds/` + speciesId);
    return response.data;
  } catch (error) {
    console.error("Error during fetching breeds:", error);
    throw error;
  }
  
};

export const getSpecies = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/species`);
    return response.data;
  } catch (error) {
    console.error("Error during fetching species:", error);
    throw error;
  }
  
};

export const createPet = async (petData: CreatePetDto, ownerId: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/pet/createPet/` + ownerId, petData);
    return response.data;
  } catch (error) {
    console.error("Error during creating pet:", error);
    throw error;
  }
  
};

export const getPetById = async (petId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/getPet/` + petId);
    return response.data;
  } catch (error) {
    console.error("Error during fetching pet:", error);
    throw error;
  }
  
};

export const updatePetStatus = async (data: UpdatePetStatusDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/pet/updatePetStatus`, data);
    return response.data;
  } catch (error) {
    console.error("Error during updating pet:", error);
    throw error;
  }
};

export const updatePetNeutered = async (petId: string) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/pet/updatePetNeutered/${petId}`);
    return response.data;
  } catch (error) {
    console.error("Error during updating pet:", error);
    throw error;
  }
};


export const uploadPetImage = async (petId: string, file: FormData) => {
  try {
    console.log(petId)
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/pet/savePetImage/` + petId, file);
    return response.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }

};