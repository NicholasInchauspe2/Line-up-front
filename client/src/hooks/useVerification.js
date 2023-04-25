import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function useVerification() {
  const [user, setUser] = useState(null);
  const { data } = useSession();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (data && data?.user) {
          const tokenUser = await axios.get(
            `https://line-up-back.onrender.com/api/user/validate/token?token=${data.user}`,
            {},
            { withCredentials: true, credentials: "include" }
          );
          if (tokenUser) {
            setUser(tokenUser.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [data]);
  return { data, user };
}
