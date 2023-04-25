import FormEditBranch from "@/components/FormNewBranch/FormEditBranch";
import axios from "axios";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const token = await getSession(context);
  const { id } = context.query;
  if (!token.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const branch = await axios.get(
      `https://line-up-back.onrender.com/api/admin/get-one-branch/${id}/token?token=${token.user}`,
      {},
      { withCredentials: true, credentials: "include" }
    );
    return {
      props: {
        branch: branch.data.data,
      },
    };
  }
}
export default function EditBranches({ branch }) {
  return <FormEditBranch branch={branch} />;
}
