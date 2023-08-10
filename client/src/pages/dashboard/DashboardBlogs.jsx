import React, { useEffect } from "react";
import { ComponentLoading, Table } from "../../components";
import { setBlogs } from "../../features/blog/blogSlice";
import { useDispatch } from "react-redux";
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
} from "../../features/blog/blogApiSlice";
import { Avatar as MuiAvatar } from "@mui/material";
import dateFormat from "../../common/dateFormat";

const DashboardBlogs = () => {
  const { data, isLoading } = useGetBlogsQuery();
  const dispatch = useDispatch();
  const updatedData = data?.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteBlog(_id);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setBlogs(data));
    }
  }, [isLoading]);

  const cols = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "title",
      headerName: "Title",
      width: 350,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "author",
      headerName: "Author",
      headerAlign: "center",
      align: "left",
      minWidth: 250,
      renderCell: ({ row: { author } }) => {
        return (
          <div className="flex gap-2 items-center">
            <MuiAvatar
              alt={author?.name}
              src={author?.profilePicture}
              sx={{ width: 36, height: 36 }}
              className="border-2 border-primary"
            />
            {author.name}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { createdAt } }) => {
        const formattedDate = dateFormat(createdAt);
        return <p>{formattedDate}</p>;
      },
    },
    {
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      minWidth: 250,
      renderCell: ({ row: { _id } }) => {
        return (
          <div
            className="rounded shadow-md w-[40%] text-center cursor-pointer  bg-primaryLight
            hover:bg-primary text-light py-2"
            onClick={() => handleDelete(_id)}
          >
            Delete
          </div>
        );
      },
    },
  ];

  return (
    <section className="mx-auto px-6 flex justify-center items-center h-[100vh]">
      <div className="w-full h-[90%] flex justify-center items-center">
        {isLoading ? (
          <ComponentLoading />
        ) : (
          <Table
            rows={updatedData}
            cols={cols}
          />
        )}
      </div>
    </section>
  );
};

export default DashboardBlogs;
