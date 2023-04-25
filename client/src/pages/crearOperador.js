import FormNewOperator from "@/components/FormNewOperator/FormNewOperator";
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
      `https://matias-lineup.onrender.com/api/admin/get-enabled-branches/token?token=${token?.user}`,
      {},
      { withCredentials: true, credentials: "include" }
    );
    const data = await response.json();
    return {
      props: {
        branches: data.data,
      },
    };
  }
}
export default function CrearSucursal({ branches }) {
  return <FormNewOperator branches={branches} />;
}
