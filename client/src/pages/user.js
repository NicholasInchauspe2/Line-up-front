import FormUserData from "@/components/FormUseData/FormUserData";
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
  }
  return { props: {} };
}

const user = () => {
  return <FormUserData />;
};

export default user;
