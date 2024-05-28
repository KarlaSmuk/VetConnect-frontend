import axios from 'axios'
import { CreateInvoiceDto } from './types/api.requests.types';

export const createInvoice = async (invoiceData: CreateInvoiceDto) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/invoice`, invoiceData);
      return response.data.message;
    } catch (error) {
      console.error("Error during creating invoices:", error);
      return false
    }
    
};

export const getInvoicesByVisitId = async (visitId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/invoice?visitId=` + visitId);
      return response.data.message;
    } catch (error) {
      console.error("Error during fetching invoice:", error);
      throw error;
    }
    
};