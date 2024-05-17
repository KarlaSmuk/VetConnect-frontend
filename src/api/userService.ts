import axios from 'axios'

export const createUser = async (user: CreateUserDto) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, user);
    return response.data;
  } catch (error) {
    console.error("Error during creating owner:", error);
    throw error;
  }

};

export const updateUser = async (user: UpdateUserDto) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update`, user);
    console.log(response)
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