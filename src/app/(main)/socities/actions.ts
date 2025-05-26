import axios from 'axios';

export async function listOfSocieties() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/getAll`);
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
