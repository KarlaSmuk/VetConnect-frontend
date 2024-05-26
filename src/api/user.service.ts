import axios from 'axios'
import { CreateUserDto, UpdateUserDto } from './types/api.requests.types';

export const createUser = async (user: CreateUserDto, clinicId?: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user${clinicId ? `/${clinicId}` : ''}`, user);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};

export const updateUser = async (user: UpdateUserDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update`, user);
    return response.data;
  } catch (error) {
    console.error("Error during updating user:", error);
    throw error;
  }

};

export const getUser = async (userId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/` + userId);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/delete/` + userId);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};

export const sendOTP = async (userId: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/sendOTP/` + userId);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};

export const uploadImage = async (userId: string, file: FormData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/saveProfileImage/` + userId, file);
    return response.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }

};