import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Table = ({ cols, rows }) => {
  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={cols}
      slots={{ toolbar: GridToolbar }}
      sx={{ overflowX: "scroll" }}
    />
  );
};

export default Table;
