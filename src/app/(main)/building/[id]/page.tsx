"use client";
import TitleWithButton from "@/common/TitleWithButton";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CommonDialog from "@/common/CommonDialog";
import { Controller, useForm } from "react-hook-form";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBuildinges } from "./actions";

const columns: GridColDef[] = [
  { field: "buildingName", headerName: "Name" },
  { field: "heaight", headerName: "Socity" },
  { field: "user", headerName: "Authorities", flex: 1 },
  {
    field: "Actions",
    headerName: "Action",
    renderCell: ({ row }) => (
      <div>
        <IconButton aria-label="delete" color="primary" size="medium">
          <ModeEditIcon fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="delete" color="error" size="medium">
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </div>
    ),
  },
];
const rows = [
  { id: 1, Address: "Snow", Name: "Jon", Socity: "Madhuram" },
  { id: 2, Address: "Lannister", Name: "Cersei", Socity: "sahajanand" },
  { id: 3, Address: "Stark", Name: "Arya", Socity: "Rajiv Gandhi" },
  { id: 4, Address: "Baratheon", Name: "Tyrion", Socity: "Gandhi" },
  { id: 5, Address: "Greyjoy", Name: "Arya", Socity: "Rajiv Gandhi" },
  { id: 6, Address: "Targaryen", Name: "Daenerys", Socity: "Rajiv Gandhi" },
];
const paginationModel = { page: 0, pageSize: 5 };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id } = use(params);
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
      Socity: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setOpen(false);
    reset(); // clear the form
  };

  const lstBuildings = useQuery({
    queryKey: ["LstBuildings", id],
    queryFn: async () => await getBuildinges(id),
  });
  return (
    <>
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
            display: "flex",
            flexDirection: "column",
            gap: 17,
          }}
        >
          <TitleWithButton
            title="Building"
            buttonText="Create"
            onClick={() => setOpen(true)}
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
              rows={lstBuildings?.data?.data}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              onRowClick={(params) => {
                router.push(`/flour/${params.row._id}`);
              }}
              getRowId={(row) => row._id}
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
              }}
            />
          </Paper>
        </div>
      </Box>
      <CommonDialog
        open={open}
        dialogProps={{
          maxWidth: "sm",
        }}
        onClose={() => setOpen(false)}
        title="Add New Building"
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 12 }}>
                <Controller
                  name="Socity"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Socity is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.Socity}>
                      <InputLabel id="socity-label">Socity</InputLabel>
                      <Select
                        labelId="socity-label"
                        id="socity"
                        label="Socity"
                        {...field}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                      <FormHelperText>{errors.Socity?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 12 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
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
            <Button
              variant="contained"
              form="society-form"
              color="primary"
              type="submit"
            >
              Save
            </Button>
          </>
        }
      />
    </>
  );
}
