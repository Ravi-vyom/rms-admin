import axios from "axios";

export async function getRoles() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/list`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function addRole(data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/add`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editRole(id: string, data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/update/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRole(id: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/delete/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadedImage(data: FormData) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/assets/upload_image`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadedUpdateImage(data: FormData) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/assets/update-profile-pic`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
