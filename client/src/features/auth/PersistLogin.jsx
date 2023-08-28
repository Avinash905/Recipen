import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useRefreshMutation } from "./authApiSlice";
import PageLoading from "../../components/loading/PageLoading";

const PersistLogin = () => {
  const persist = localStorage.getItem("persist");
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      }
    };
    if (persist === "true") verifyRefreshToken();
  }, []);

  if (isLoading) {
    return <PageLoading />;
  } else return <Outlet />;
};
export default PersistLogin;
