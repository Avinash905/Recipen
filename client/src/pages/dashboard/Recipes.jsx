import React from "react";
import { Table } from "../../components";

const index = () => {
  const rows = [
    {
      id: 1,
      title: "John Doe",
      author: "john@example.com",
      profilePicture:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1",
      rating: 4,
      updatedAt: "2/12/2015",
    },
  ];

  const cols = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "title",
      headerName: "Title",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "author",
      headerName: "Author",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      renderCell: ({ row: { author, profilePicture } }) => {
        return (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8">
              <img
                src={profilePicture}
                alt=""
                className="rounded-full border-primary border-2 w-full h-full object-cover"
              />
            </div>
            {author}
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
