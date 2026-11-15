import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { useDispatch, useStore } from "react-redux";
import { logOut, setRestoring } from "./authSlice";
import { RestoreContext } from "./RestoreContext";

const PersistLogin = () => {
  const persist = localStorage.getItem("persist");
  const [refresh] = useRefreshMutation();
  const dispatch = useDispatch();
  const store = useStore();
  const [failed, setFailed] = useState(false);

  const verifyRefreshToken = useCallback(async () => {
      setFailed(false);
      dispatch(setRestoring(true));
      const startingToken = store.getState().auth.token;
      let retryableFailure = false;
      try {
        await refresh().unwrap();
      } catch (err) {
        if ([401, 403].includes(err?.status) && store.getState().auth.token === startingToken) {
          dispatch(logOut());
          localStorage.setItem("persist", false);
        } else if (store.getState().auth.token === startingToken && localStorage.getItem("persist") === "true") {
          retryableFailure = true;
          setFailed(true);
        }
      } finally {
        if (!retryableFailure) dispatch(setRestoring(false));
      }
    }, [refresh, dispatch, store]);
  useEffect(() => {
    if (persist === "true") verifyRefreshToken();
  }, [persist, verifyRefreshToken]);

  return <RestoreContext.Provider value={{ failed }}>
    {failed && <div role="alert" className="mx-auto max-w-7xl bg-[#fbf8f3] px-6 py-3 text-sm">Could not restore your session. Check your connection and <button type="button" className="font-semibold underline" onClick={verifyRefreshToken}>try again</button>.</div>}
    <Outlet />
  </RestoreContext.Provider>;
};
export default PersistLogin;
