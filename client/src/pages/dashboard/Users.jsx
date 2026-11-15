import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ComponentLoading from "../../components/loading/ComponentLoading";
import usePageBounds from "../../hooks/usePageBounds";
import Table from "../../components/dashboard/Table";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setUsers } from "../../features/user/userSlice";
import {
  useGetUsersQuery,
  useDisableUserMutation,
  useEnableUserMutation,
} from "../../features/user/userApiSlice";
import { Avatar as MuiAvatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { toast } from "react-toastify";

const Users = () => {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Math.min(100000, parseInt(params.get("page"), 10) || 1));
  const search = params.get("search") || "";
  const changePage = (nextPage) => { const next = new URLSearchParams(params); next.set("page", String(nextPage)); setParams(next); };
  const changeSearch = (value) => { const next = new URLSearchParams(params); if (value) next.set("search", value); else next.delete("search"); next.set("page", "1"); setParams(next, { replace: true }); };
  const { currentData: data, isFetching: isLoading, isError, refetch } = useGetUsersQuery({ page, limit: 12, search });
  usePageBounds(page, data, isLoading, setParams);
  const dispatch = useDispatch();
  const updatedData = data?.items?.map((item) => ({
    ...item,
    id: item._id,
  }));
  const [disableUser, { isLoading: isDisabling }] = useDisableUserMutation();
  const [enableUser, { isLoading: isEnabling }] = useEnableUserMutation();
  const [pendingUser, setPendingUser] = useState(null);
  const [statusError, setStatusError] = useState("");
  const isUpdating = isDisabling || isEnabling;

  const handleStatusChange = async () => {
    if (!pendingUser) return;
    setStatusError("");
    try {
      await (pendingUser.isDisabled ? enableUser(pendingUser._id) : disableUser(pendingUser._id)).unwrap();
      toast.success(pendingUser.isDisabled ? "Account enabled" : "Account disabled");
      setPendingUser(null);
    } catch (error) {
      setStatusError(error?.data?.message || "Could not update account status. Please try again.");
    }
  };
  useEffect(() => {
    if (!isLoading) {
      dispatch(setUsers(data?.items));
    }
  }, [isLoading, data, dispatch]);

  const cols = [
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "left",
      minWidth: 250,
      renderCell: ({ row: { name, profilePicture } }) => {
        return (
          <div className="flex gap-2 items-center">
            <MuiAvatar
              alt={name}
              src={profilePicture}
              sx={{ width: 36, height: 36 }}
              className="border-2 border-primary"
            />
            {name}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "left",
      minWidth: 280,
    },
    {
      field: "roles",
      headerName: "Role",
      headerAlign: "center",
      minWidth: 300,
      renderCell: ({ row: { roles } }) => {
        return (
          <div
            className={
              "rounded text-sm py-1 px-3 mx-auto w-[40%] shadow-none bg-gray-200 text-gray-700 flex items-center gap-2 justify-evenly"
            }
          >
            {roles?.includes("Admin") ? (
              <MdAdminPanelSettings />
            ) : roles?.includes("ProUser") ? (
              <RiAdminFill />
            ) : (
              <BiSolidUser />
            )}
            {roles?.includes("Admin")
              ? "Admin"
              : roles?.includes("ProUser")
              ? "Pro User"
              : "Basic User"}
          </div>
        );
      },
    },
    {
      field: "isDisabled",
      headerName: "Account status",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row: { isDisabled, _id, name } }) => {
        return (
          <div className="flex items-center gap-3"><span>{isDisabled ? "Disabled" : "Active"}</span><button
            type="button"
            className="rounded shadow-md px-4 py-2 bg-primaryLight text-[#29251f] disabled:opacity-60"
            disabled={isUpdating}
            onClick={() => { setStatusError(""); setPendingUser({ _id, name, isDisabled }); }}
          >
            {isDisabled ? "Enable" : "Disable"}
          </button></div>
        );
      },
    },
  ];

  return (
    <>
    <section className="mx-auto flex h-screen min-w-0 w-full flex-col px-3 py-6 sm:px-8">
      <header className="mb-5 shrink-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80603b]">Dashboard</p><h1 className="mt-2 font-serif text-3xl">Users</h1><p className="mt-1 text-sm text-[#6b6257]">Manage account access.</p></header>
      <label className="mb-3 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:items-center">Search users<input type="search" value={search} onChange={(event) => changeSearch(event.target.value)} className="w-full max-w-full rounded-lg border border-[#cfc6ba] px-3 py-2 font-normal sm:w-auto" placeholder="Name or email" /></label>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-2xl border border-[#e8e1d7] bg-white p-2 sm:p-4">
        {isLoading ? <ComponentLoading /> : isError ? <div role="alert" className="p-4">Could not load users. <button type="button" onClick={refetch} className="underline">Try again</button></div> : updatedData?.length === 0 ? <div className="p-4" role="status"><p>{search ? "No matching results." : "No items yet."}</p>{search && <button type="button" className="mt-3 underline" onClick={() => changeSearch("")}>Clear search</button>}</div> : <><div className="hidden h-full xl:block"><Table rows={updatedData} cols={cols} /></div><div className="space-y-3 xl:hidden">{updatedData?.length === 0 && <p className="p-4 text-sm text-[#6b6257]">No matching results.</p>}{updatedData?.map((row) => <article key={row.id} className="rounded-xl border border-[#e8e1d7] p-4"><h2 className="break-words font-semibold">{row.name}</h2><p className="break-all text-sm text-[#6b6257]">{row.email}</p><p className="mt-2 text-sm">{row.roles?.includes("Admin") ? "Admin" : row.roles?.includes("ProUser") ? "Pro user" : "Basic user"} · {row.isDisabled ? "Disabled" : "Active"}</p><button type="button" disabled={isUpdating} className="mt-3 rounded bg-primaryLight px-4 py-2 font-semibold" onClick={() => { setStatusError(""); setPendingUser(row); }}>{row.isDisabled ? "Enable" : "Disable"}</button></article>)}</div></>}
      </div>
      {!isLoading && !isError && <nav aria-label="Users pages" className="mt-3 flex flex-wrap items-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, Math.ceil((data?.total || 0) / 12))} · {data?.total || 0} total</span><button type="button" disabled={page * 12 >= (data?.total || 0)} onClick={() => changePage(page + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Next</button></nav>}
    </section>
    <Dialog open={Boolean(pendingUser)} onClose={isUpdating ? undefined : () => setPendingUser(null)} aria-labelledby="account-status-title">
      <DialogTitle id="account-status-title">{pendingUser?.isDisabled ? "Enable account?" : "Disable account?"}</DialogTitle>
      <DialogContent><DialogContentText>{pendingUser?.isDisabled ? `Enable ${pendingUser?.name}'s account? They can sign in again.` : `Disable ${pendingUser?.name}'s account? They will lose access.`}</DialogContentText>{statusError && <DialogContentText color="error" role="alert">{statusError}</DialogContentText>}</DialogContent>
      <DialogActions>
        <Button disabled={isUpdating} onClick={() => setPendingUser(null)}>Cancel</Button>
        <Button disabled={isUpdating} onClick={handleStatusChange}>{pendingUser?.isDisabled ? "Enable" : "Disable"}</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default Users;
