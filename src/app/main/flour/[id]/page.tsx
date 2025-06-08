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
import { addFlour, deleteFlour, editFlour, listOfFlour } from "./actions";
import { showError, showSuccess } from "@/components/utils/toast";
import Swal from "sweetalert2";

const paginationModel = { page: 0, pageSize: 5 };
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objFlour, setobjFlour] = useState<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flourName: "",
    },
  });

  const lstFlour = useQuery({
    queryKey: ["LstBuilding", id],
    queryFn: async () => await listOfFlour(id),
  });

  const columns: GridColDef[] = [
    {
      field: "buildingId",
      headerName: "Bulding",
      width: 160,
      renderCell: ({ row }) => row?.buildingId?.buildingName,
    },
    { field: "flourName", headerName: "Name", flex: 1 },

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
              setobjFlour(row);
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
                  await deleteFlour(row._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "The item has been successfully deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  lstFlour.refetch();
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
    setobjFlour(undefined);
    reset({ flourName: "" });
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objFlour?._id) {
        const response = await editFlour(objFlour?._id, {
          flourName: data.flourName,
          buildingId: id,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlour.refetch();
          setOpen(false);
          reset({
            flourName: "",
          });
          setIsEdit(false);
        }
      } else {
        const response = await addFlour({
          flourName: data.flourName,
          buildingId: id,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlour.refetch();
          setOpen(false);
          setIsEdit(false);
          reset({
            flourName: "",
          });
        }
      }
    } catch (err: any) {
      showError(err?.response?.data?.message);
      setOpen(false);
      reset({
        flourName: "",
      });
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (objFlour && isEdit) {
      reset({
        flourName: objFlour?.flourName,
      });
    }
  }, [isEdit, objFlour]);
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
            title="Flour"
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
              rows={lstFlour?.data?.data?.data}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
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
                cursor: "pointer",
              }}
              onRowClick={(params) => {
                router.push(`/main/flat/${params.row._id}`);
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
              <Grid size={{ xs: 6, md: 12 }}>
                <TextField
                  label="Flour Name"
                  variant="outlined"
                  fullWidth
                  {...register("flourName", {
                    required: "flourName is required",
                  })}
                  error={!!errors.flourName}
                  helperText={errors.flourName?.message}
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
