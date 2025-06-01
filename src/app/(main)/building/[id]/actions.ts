import axios from "axios";

export async function listOfBuilding() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Building/getAll`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getUserPramukh() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/pramukh/list`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function addBuilding(data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Building/add`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function editBuilding(id: string, data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Building/update/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteBuilding(id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Building/delete/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
