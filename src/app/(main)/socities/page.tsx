"use client"
import TitleWithButton from "@/common/TitleWithButton";
import { Box, Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CommonDialog from "@/common/CommonDialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

const columns: GridColDef[] = [
  { field: 'Name', headerName: 'Name' },
  { field: 'Address', headerName: 'Address', flex: 1 },

  {
    field: 'Actions', headerName: 'Action',
    renderCell: ({ row }) => (
      <div>
        <IconButton aria-label="delete" color="primary" size="medium">
          <ModeEditIcon fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="delete" color="error" size="medium">
          <DeleteIcon fontSize="inherit" />
        </IconButton>

      </div>
    )
  },

];
const rows = [
  { id: 1, Address: 'Snow', Name: 'Jon', age: 35 },
  { id: 2, Address: 'Lannister', Name: 'Cersei', age: 42 },
  { id: 3, Address: 'Lannister', Name: 'Jaime', age: 45 },
  { id: 4, Address: 'Stark', Name: 'Arya', age: 16 },
  { id: 5, Address: 'Targaryen', Name: 'Daenerys', age: null },
  { id: 6, Address: 'Melisandre', Name: null, age: 150 },
  { id: 7, Address: 'Clifford', Name: 'Ferrara', age: 44 },
  { id: 8, Address: 'Frances', Name: 'Rossini', age: 36 },
  { id: 9, Address: 'Roxie', Name: 'Harvey', age: 65 },
];
const paginationModel = { page: 0, pageSize: 5 };

export default function Socity() {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Name: "",
      Address: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setOpen(false);
    reset(); // clear the form
  };

  return (
    <div>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3
      }}>
        <div style={{
          width: "92%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 17
        }}>
          <TitleWithButton title="Socities" buttonText="Create" onClick={() => setOpen(true)} />
          <Paper elevation={5} sx={{ height: "100%", marginBottom: 2, borderRadius: 5, overflow: "hidden", py: 2 }}>

            <DataGrid
              disableColumnFilter
              rowSelection={false}
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              onRowClick={(params) => {
                router.push(`/building/${params.row.id}`);
              }}
              sx={{
                border: 0, width: "100%", height: "100%",
                '& .MuiDataGrid-columnHeaders': {
                  color: "black",
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: "600"
                }
              }}
            />
          </Paper>
        </div>
      </Box>
      <CommonDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Society"
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={4}>
              <Grid size={{ xs: 6, md: 12 }}>
                <TextField label="Name" variant="outlined" fullWidth
                  {...register("Name", { required: "Name is required" })}
                  error={!!errors.Name}
                  helperText={errors.Name?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 12 }}>
                <TextField
                  id="outlined-multiline-static"
                  label="Address"
                  multiline
                  rows={4}
                  defaultValue="Default Value"
                  fullWidth
                  {...register("Address", { required: "Address is required" })}
                  error={!!errors.Address}
                  helperText={errors.Address?.message}
                />
              </Grid>
            </Grid>
          </form>
        }
        actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" form="society-form" color="primary" type="submit">
              Confirm
            </Button>
          </>
        }
      />
    </div>
  )
}
