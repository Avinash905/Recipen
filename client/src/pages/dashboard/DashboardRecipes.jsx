import React, { useEffect } from "react";
import { ComponentLoading, Table } from "../../components";
import { setRecipes } from "../../features/recipe/recipeSlice";
import { useDispatch } from "react-redux";
import {
  useGetRecipesQuery,
  useDeleteRecipeMutation,
} from "../../features/recipe/recipeApiSlice";
import { Avatar as MuiAvatar, Rating } from "@mui/material";

const DashboardRecipes = () => {
  const { data, isLoading } = useGetRecipesQuery();
  console.log(data);
  const dispatch = useDispatch();
  const updatedData = data?.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  const [deleteRecipe] = useDeleteRecipeMutation();

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteRecipe(_id);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setRecipes(data));
    }
  }, [isLoading]);

  const cols = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "title",
      headerName: "Title",
      width: 280,
      headerAlign: "center",
      align: "left",
      renderCell: ({ row: { recipeName } }) => {
        return <div className="flex gap-2 items-center">{recipeName}</div>;
      },
    },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      headerAlign: "center",
      align: "left",
      renderCell: ({ row: { image } }) => {
        return (
          <div className="flex gap-2 items-center">
            {
              <img
                alt={image}
                src={image}
                sx={{ width: 36, height: 36 }}
                className="border-2 border-primary"
              />
            }
          </div>
        );
      },
    },
    {
      field: "author",
      headerName: "Author",
      headerAlign: "center",
      align: "left",
      minWidth: 200,
      renderCell: ({ row: { author } }) => {
        return (
          <div className="flex gap-2 items-center">
            <MuiAvatar
              alt={author?.firstName}
              src={author?.profilePicture}
              sx={{ width: 36, height: 36 }}
              className="border-2 border-primary"
            />
            {author.firstName + " " + author.lastName}
          </div>
        );
      },
    },
    {
      field: "ratings",
      headerName: "Rating",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { ratings } }) => {
        const sumOfRatings = ratings.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        const averageRating =
          sumOfRatings === 0 ? 0 : sumOfRatings / ratings.length;
        return <Rating value={averageRating} readOnly={true} size={"medium"} />;
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
          <Table rows={updatedData} cols={cols} />
        )}
      </div>
    </section>
  );
};

export default DashboardRecipes;
