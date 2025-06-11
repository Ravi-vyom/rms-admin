import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export async function listSubAdmin() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/subAdmin/list`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
