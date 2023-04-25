import Appoinments from "@/components/Appoinments/Appoinments";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const pagination = context.params.id;
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
      `https://line-up-back.onrender.com/api/appointments/user-appointments/${pagination}?token=${token.user}`,
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

export default function Register({ branches, length }) {
  return <Appoinments branches={branches} length={length} />;
}
