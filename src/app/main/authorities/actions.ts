import axios from "axios";
import Cookies from "js-cookie";
const token = Cookies.get("token");

export async function listAuthorities() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/head/list`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
