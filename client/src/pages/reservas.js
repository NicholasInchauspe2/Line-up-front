import Appoinments from "@/components/Appoinments/Appoinments";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const token = await getSession(context);
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const response = await fetch(
      `https://matias-lineup.onrender.com/api/appointments/user-appointments/1?token=${token.user}`,
      {},
      { withCredentials: true, credentials: "include" }
    );
    const data = await response.json();
    return {
      props: {
        branches: data.data,
        length: data.length,
      },
    };
  }
}

export default function Register({ branches }) {
  return <Appoinments branches={branches} />;
}
