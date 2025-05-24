import axios from 'axios';

export async function loginAdmin(data:any) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,data);
    return response;
  } catch (error) {
    console.error('Failed to fetch users', error);
    throw error;
  }
}
