import axios from "axios";

export async function listOfSocieties() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/getAll`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUser(data: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/getAll`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserList(){
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/list`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function addSociety(data:any){
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/add`,data);
    return response;
  } catch (error) {
    throw error;
  }
}


export async function editSociety(id:string,data:any){
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/update/${id}`,data);
    return response;
  } catch (error) {
    throw error;
  }
}


export async function deleteSociety(id:string){
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/Heaight/delete/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}