import axios from 'axios'
import { LoginRegisterDto, VerifyOTPDto } from './types/auth.types';

export const loginUser = async (loginData: LoginRegisterDto) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, loginData);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
    
};

export const registerUser = async (registerData: LoginRegisterDto) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/register`, registerData);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
    
};

export const verifyOTP = async (verifyOtpData: VerifyOTPDto) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify`, verifyOtpData);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
    
};