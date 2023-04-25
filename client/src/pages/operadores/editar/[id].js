import FormEditOperator from "@/components/FormEditOperator/FormEditOperator";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  let id = context.query.id;
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
        `https://line-up-back.onrender.com/api/admin/get-one-operator/${id}/token?token=${session.user}`,
        {},
        { withCredentials: true, credentials: "include" }
      );

      const data = await res.json();

      return {
        props: {
          user: data.user,
          branchName: data.branchName,
          idLocation: data.idLocation,
        },
      };
    }
  }
}

export default function EditarOperador({ user, branchName, idLocation }) {
  return (
    <FormEditOperator
      user={user}
      branchName={branchName}
      idLocation={idLocation}
    />
  );
}
