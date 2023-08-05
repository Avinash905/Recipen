import React from "react";
import { Table } from "../../components";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";

const index = () => {
  const rows = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      isAdmin: false,
      isSubscribed: false,
      isDisabled: true,
      profilePicture:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      isAdmin: true,
      isSubscribed: false,
      isDisabled: false,
      profilePicture:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1",
    },
    {
      id: 3,
      name: "John Jane",
      email: "johnjane@example.com",
      isAdmin: false,
      isSubscribed: true,
      isDisabled: false,
      profilePicture:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1",
    },
  ];

  const cols = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      renderCell: ({ row: { name, profilePicture } }) => {
        return (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8">
              <img
                src={profilePicture}
                alt=""
                className="rounded-full border-primary border-2 w-full h-full object-cover"
              />
            </div>
            {name}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
    },
    {
      field: "isAdmin",
      headerName: "Role",
      headerAlign: "center",
      minWidth: 220,
      renderCell: ({ row: { isAdmin } }) => {
        return (
          <div
            className={
              "rounded text-sm py-1 mx-auto w-[40%] shadow-none bg-gray-200 text-gray-700 flex items-center gap-2 justify-center"
            }
          >
            {isAdmin ? <MdAdminPanelSettings /> : <BiSolidUser />}
            {isAdmin ? "Admin" : "User"}
          </div>
        );
      },
    },
    {
      field: "isSubscribed",
      headerName: "Subscription",
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      renderCell: ({ row: { isSubscribed } }) => {
        return (
          <div
            className={`rounded-full py-1 px-3 ${
              isSubscribed ? "text-[#14804A]" : "text-[#4F5AED]"
            } ${isSubscribed ? "bg-[#E1FCEF]" : "bg-[#F0F1FA]"}`}
          >
            {isSubscribed ? "Pro" : "Basic"}
          </div>
        );
      },
    },
    {
      field: "isDisabled",
      headerName: "Disabled",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row: { isDisabled } }) => {
        return (
          <div
            className={`rounded shadow-md w-[40%] py-1 text-center cursor-pointer ${
              isDisabled ? "bg-[#fad57f]" : "bg-primaryLight"
            } ${
              isDisabled ? "hover:bg-[#fad57f]" : "hover:bg-primary"
            } text-light py-2`}
          >
            {isDisabled ? "Disabled" : "Disable"}
          </div>
        );
      },
    },
  ];

  return (
    <section className="mx-auto px-6 flex justify-center items-center h-[100vh]">
      <div className="w-full h-[90%] flex justify-center items-center">
        <Table
          rows={rows}
          cols={cols}
        />
      </div>
    </section>
  );
};

export default index;
