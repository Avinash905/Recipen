import P from "prop-types";
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector } from "@mui/x-data-grid";

const Toolbar = () => <GridToolbarContainer><GridToolbarColumnsButton /><GridToolbarDensitySelector /></GridToolbarContainer>;

const Table = ({ cols, rows }) => {
  return (
    <DataGrid
      rows={rows || []}
      columns={cols}
      slots={{ toolbar: Toolbar }}
      disableColumnSorting
      hideFooter
      sx={{ width: "100%", minWidth: 0 }}
    />
  );
};

Table.propTypes = { cols: P.array.isRequired, rows: P.array };

export default Table;
