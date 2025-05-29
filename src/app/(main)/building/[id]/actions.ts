import axios from "axios";
import Cookies from "js-cookie";

export async function getBuildinges(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Building/by-heaight/${id}`,
      {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
