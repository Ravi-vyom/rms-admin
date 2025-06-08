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
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { addFlat, deleteFlat, editFlat, listOfFlat } from "./actions";
import { showError, showSuccess } from "@/components/utils/toast";
import Swal from "sweetalert2";

const paginationModel = { page: 0, pageSize: 5 };
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objFlat, setobjFlat] = useState<any>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flatName: "",
    },
  });
  const lstFlat = useQuery({
    queryKey: ["LstFlat", id],
    queryFn: async () => await listOfFlat(id),
  });

  const handleClose = () => {
    setIsEdit(false);
    setobjFlat(undefined);
    reset({ flatName: "" });
    setOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "flourId",
      headerName: "Flour",
      renderCell: ({ row }) => row?.flourId?.flourName,
    },
    { field: "flatName", headerName: "Name", flex: 1 },
    {
      field: "isBooked",
      headerName: "Status",
      flex: 1,
      renderCell: ({ value }) => (
        <span style={{ color: value === "Booked" ? "green" : "red" }}>
          {value === "Booked" ? "Booked" : "UnBooked"}
        </span>
      ),
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
              setobjFlat(row);
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
                  await deleteFlat(row._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "The item has been successfully deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  lstFlat.refetch();
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

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objFlat?._id) {
        const response = await editFlat(objFlat?._id, {
          flatName: data.flatName,
          flourId: id,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlat.refetch();
          setOpen(false);
          reset({
            flatName: "",
          });
          setIsEdit(false);
        }
      } else {
        const response = await addFlat({
          flatName: data.flatName,
          flourId: id,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlat.refetch();
          setOpen(false);
          setIsEdit(false);
          reset({
            flatName: "",
          });
        }
      }
    } catch (err: any) {
      showError(err?.response?.data?.message);
      setOpen(false);
      reset({
        flatName: "",
      });
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (objFlat && isEdit) {
      reset({
        flatName: objFlat?.flatName,
      });
    }
  }, [isEdit, objFlat]);

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
            title="Flat"
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
              rows={lstFlat?.data?.data?.data}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              getRowId={(row) => row._id}
              checkboxSelection={false}
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
        onClose={handleClose}
        title={isEdit ? "Edit" : "Add"}
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  label="Flat No"
                  variant="outlined"
                  fullWidth
                  {...register("flatName", {
                    required: "Flat No is required",
                  })}
                  error={!!errors.flatName}
                  helperText={errors.flatName?.message}
                />
              </Grid>
            </Grid>
          </form>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
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
