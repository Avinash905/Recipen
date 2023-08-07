import React from "react";
import { Table } from "../../components";

const Dashboard = () => {
  const rows = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      isAdmin: true,
      isSubscribed: false,
    },
    {
      id: 3,
      name: "John Jane",
      email: "johnjane@example.com",
      isAdmin: false,
      isSubscribed: true,
    },
  ];

  const cols = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email" },
    { field: "isAdmin", headerName: "Admin" },
    { field: "isSubscribed", headerName: "Subscribed" },
  ];

  return (
    <section>
      <Table
        rows={rows}
        cols={cols}
      />
    </section>
  );
};

export default Dashboard;
