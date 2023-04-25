import FormReserva from "@/components/FormReserva/reserva";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    if (session.user) {
      const res = await fetch(
        `https://line-up-back.onrender.com/api/user/validate/token?token=${session.user}`,
        {},
        { withCredentials: true, credentials: "include" }
      );
      const data = await res.json();
      const response = await fetch(
        "https://line-up-back.onrender.com/api/appointments/branches",
        {},
        { withCredentials: true, credentials: "include" }
      );
      const branchData = await response.json();

      return {
        props: {
          branches: branchData,
          user: data,
        },
      };
    }
  }
}

export default function Reserva({ branches, user }) {
  return <FormReserva branches={branches} user={user} />;
}
