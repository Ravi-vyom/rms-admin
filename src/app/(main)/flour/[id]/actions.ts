import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export async function listOfFlour() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Flour/getAll`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function addFlour(data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Flour/add`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function editFlour(id: string, data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Flour/update/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteFlour(id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Flour/delete/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
