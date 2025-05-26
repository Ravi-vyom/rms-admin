"use client"
import TitleWithButton from "@/common/TitleWithButton";
import { Box, Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CommonDialog from "@/common/CommonDialog";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listOfSocieties } from "./actions";

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 170, },
  { field: 'address', headerName: 'Address', flex: 1 },

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

const paginationModel = { page: 0, pageSize: 5 };

export default function Socity() {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Name: "",
      Address: "",
      Authorities: [
        {
          user: ""
        }
      ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Authorities"
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setOpen(false);
    reset(); // clear the form
  };

  const lstSocieties = useQuery({
    queryKey: ["LstSocieties"],
    queryFn: async () => await listOfSocieties()
  })

  console.log(lstSocieties?.data?.data?.data)

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
              rows={lstSocieties?.data?.data?.data}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              onRowClick={(params) => {
                router.push(`/building/${params.row._id}`);
              }}
              getRowId={(row) => row._id}
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
                {fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <TextField
                      label={`User ID #${index + 1}`}
                      fullWidth
                      {...register(`Authorities.${index}.user`, { required: "User ID is required" })}
                      error={!!errors?.Authorities?.[index]?.user}
                      helperText={errors?.Authorities?.[index]?.user?.message}
                    />
                    <IconButton color="error" onClick={() => remove(index)}><DeleteIcon /></IconButton>
                  </Box>
                ))}
                <Button onClick={() => append({ user: "" })} variant="outlined" sx={{ mt: 1 }}>
                  Add Authority
                </Button>
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
