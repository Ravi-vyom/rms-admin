"use client";
import CommonDialog from "@/common/CommonDialog";
import TitleWithButton from "@/common/TitleWithButton";
import { showError, showSuccess } from "@/components/utils/toast";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Box,
  Button,
  Chip,
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
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  addBuilding,
  deleteBuilding,
  editBuilding,
  getUserPramukh,
  listOfBuilding,
} from "./actions";
import Swal from "sweetalert2";

const paginationModel = { page: 0, pageSize: 5 };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objBuilding, setObjBuilding] = useState<any>();
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
      User: "",
    },
  });

  const lstBilding = useQuery({
    queryKey: ["LstBuilding", id],
    queryFn: async () => await listOfBuilding(id),
  });

  const lstPramukh = useQuery({
    queryKey: ["LstPramukh"],
    queryFn: async () => await getUserPramukh(),
  });

  const columns: GridColDef[] = [
    {
      field: "heaight",
      headerName: "Heaight",
      width: 200,
      renderCell: ({ row }) => row?.heaight?.name,
    },
    { field: "buildingName", headerName: "Building Name", width: 200 },
    {
      field: "authorities",
      headerName: "Authorities",
      flex: 1,
      renderCell: ({ row }) =>
        row?.heaight?.authorities?.map((auth: any, index: number) => (
          <Chip
            key={index}
            label={auth?.user?.name}
            size="small"
            color="primary"
          />
        )),
    },
    {
      field: "Actions",
      headerName: "Action",
      renderCell: ({ row }) => (
        <div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
              setIsEdit(true);
              setObjBuilding(row);
            }}
            aria-label="delete"
            color="primary"
            size="medium"
          >
            <ModeEditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone. Do you really want to delete this item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await deleteBuilding(row._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "The item has been successfully deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  lstBilding.refetch();
                }
              });
            }}
            aria-label="delete"
            color="error"
            size="medium"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleClose = () => {
    setIsEdit(false);
    setObjBuilding(undefined);
    reset({ Name: "", User: "" });
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objBuilding?._id) {
        const response = await editBuilding(objBuilding?._id, {
          buildingName: data.Name,
          heaight: id,
          user: data.User,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstBilding.refetch();
          setOpen(false);
          reset();
        }
      } else {
        const response = await addBuilding({
          buildingName: data.Name,
          heaight: id,
          user: data.User,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstBilding.refetch();
          setOpen(false);
          reset();
        }
      }
    } catch (err: any) {
      showError(err?.response?.data?.message);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (objBuilding && isEdit) {
      reset({
        Name: objBuilding?.buildingName,
        User: objBuilding?.user,
      });
    }
  }, [isEdit, objBuilding]);

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
              rows={lstBilding?.data?.data?.data}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              getRowId={(row) => row._id}
              onRowClick={(params) => {
                router.push(`/main/flour/${params.row._id}`);
              }}
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

      <CommonDialog
        open={open}
        dialogProps={{
          maxWidth: "sm",
        }}
        onClose={handleClose}
        title={isEdit ? "Edit" : "Add"}
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...register("Name", { required: "Name is required" })}
                  error={!!errors.Name}
                  helperText={errors.Name?.message?.toString()}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Controller
                  name="User"
                  control={control}
                  rules={{ required: "Please select a Pramukh" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={errors.User ? true : false}>
                      <InputLabel id="demo-simple-select-label">
                        Pramukh
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Pramukh"
                        value={field.value || ""}
                      >
                        {lstPramukh?.data?.data?.data?.map(
                          (item: any, index: number) => (
                            <MenuItem key={index} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      {errors.User && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.User.message?.toString()}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
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
