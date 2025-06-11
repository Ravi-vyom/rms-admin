"use client";
import CommonDialog from "@/common/CommonDialog";
import DataTableLayout from "@/common/DataTableLayout";
import { showError, showSuccess } from "@/components/utils/toast";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { addFlat, deleteFlat, editFlat, getUser, listOfFlat } from "./actions";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objFlat, setobjFlat] = useState<any>();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flatName: "",
      currentMember: "",
    },
  });

  const lstFlat = useQuery({
    queryKey: ["LstFlat", id],
    queryFn: async () => await listOfFlat(id),
  });
  console.log(lstFlat.data);
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
      field: "currentMember",
      headerName: "Assigned Flat",
      flex: 1,
      renderCell: ({ row }) => row?.currentMember?.name,
    },
    {
      field: "Actions",
      headerName: "Action",
      renderCell: ({ row }) => (
        console.log(row),
        (
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
        )
      ),
    },
  ];

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objFlat?._id) {
        const response = await editFlat(objFlat?._id, {
          flatName: data.flatName,
          flourId: id,
          currentMember: data.currentMember ? data.currentMember : null,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlat.refetch();
          setOpen(false);
          reset({
            flatName: "",
            currentMember: "",
          });
          setIsEdit(false);
        }
      } else {
        const response = await addFlat({
          flatName: data.flatName,
          flourId: id,
          currentMember: data.currentMember ? data.currentMember : null,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstFlat.refetch();
          setOpen(false);
          setIsEdit(false);
          reset({
            flatName: "",
            currentMember: "",
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
  const lstUser = useQuery({
    queryKey: ["LstPramukh"],
    queryFn: async () => await getUser(),
  });

  useEffect(() => {
    if (objFlat && isEdit) {
      reset({
        flatName: objFlat?.flatName,
        currentMember: objFlat?.currentMember?._id,
      });
    }
  }, [isEdit, objFlat]);

  return (
    <>
      <DataTableLayout
        title="Flat"
        buttonText="Create"
        onButtonClick={() => setOpen(true)}
        rows={lstFlat?.data?.data?.data || []}
        columns={columns}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
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
              <Grid size={{ xs: 12, md: 12 }}>
                <Controller
                  name="currentMember"
                  control={control}
                  // rules={{ required: "Please select a User" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={errors.currentMember ? true : false}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Current User
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Current User"
                        value={field.value || ""}
                      >
                        {lstUser?.data?.data?.data?.map(
                          (item: any, index: number) => (
                            <MenuItem key={index} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      {errors.currentMember && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.currentMember.message?.toString()}
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
