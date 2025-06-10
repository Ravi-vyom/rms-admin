import React from "react";
import { Box, Paper } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import TitleWithButton from "./TitleWithButton"; // Adjust import path

interface DataTableLayoutProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  rows: any[];
  columns: GridColDef[];
  paginationModel?: GridPaginationModel;
  onRowClick?: (params: GridRowParams) => void;
  getRowId?: (row: any) => string | number;
  disableCheckbox?: boolean;
}

const DataTableLayout: React.FC<DataTableLayoutProps> = ({
  title = "Title",
  buttonText = "Create",
  onButtonClick,
  rows,
  columns,
  paginationModel = { pageSize: 10, page: 0 },
  onRowClick,
  getRowId = (row) => row._id,
  disableCheckbox = true,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <div
        style={{
          width: "92%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 17,
        }}
      >
        <TitleWithButton
          title={title}
          buttonText={buttonText}
          onClick={onButtonClick}
        />

        <Paper
          elevation={5}
          sx={{
            height: "100%",
            marginBottom: 2,
            borderRadius: 5,
            overflow: "hidden",
            py: 2,
          }}
        >
          <DataGrid
            disableColumnFilter
            rowSelection={false}
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={!disableCheckbox}
            onRowClick={onRowClick}
            getRowId={getRowId}
            sx={{
              border: 0,
              width: "100%",
              height: "100%",
              "& .MuiDataGrid-columnHeaders": {
                color: "black",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
              },
              cursor: "pointer",
            }}
          />
        </Paper>
      </div>
    </Box>
  );
};

export default DataTableLayout;
