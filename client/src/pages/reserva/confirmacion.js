import Confirmation from "@/components/Confirmation/Confirmation";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const token = await getSession(context);

  if (!token.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const response = await fetch(
      `https://line-up-back.onrender.com/api/appointments/lastAppointment/token?token=${token.user}`,
      {},
      { withCredentials: true, credentials: "include" }
    );

    const data = await response.json();
    return {
      props: {
        appointments: data,
      },
    };
  }
}
const confirmacion = ({ appointments }) => {
  return (
    <>
      <Confirmation appointments={appointments} />
    </>
  );
};

export default confirmacion;
