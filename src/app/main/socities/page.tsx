"use client";
import CommonDialog from "@/common/CommonDialog";
import DataTableLayout from "@/common/DataTableLayout";
import { showError, showSuccess } from "@/components/utils/toast";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  addSociety,
  deleteSociety,
  editSociety,
  getUserList,
  listOfSocieties,
} from "./actions";

export default function Socity() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objSociety, setSociety] = useState<any>();
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 170 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "authorities",
      headerName: "Authorities",
      flex: 1,
      renderCell: ({ row }) =>
        row.authorities?.map((auth: any) => (
          <Chip
            key={auth._id || auth.user?._id}
            label={auth.name || auth.user?.name || "Unknown"}
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
              setSociety(row);
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
                  await deleteSociety(row._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "The item has been successfully deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  lstSocieties.refetch();
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,

    formState: { errors },
  } = useForm({
    defaultValues: {
      Name: "",
      Address: "",
      Authorities:
        objSociety?.authorities?.map((a: any) => ({
          user: a.user.name || a?.user._id, // Support both formats
        })) || [],
    },
  });

  const lstSocieties = useQuery({
    queryKey: ["LstSocieties"],
    queryFn: async () => await listOfSocieties(),
  });

  const lstUser = useQuery({
    queryKey: ["lstUser"],
    queryFn: async () => await getUserList(),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objSociety?._id) {
        const response = await editSociety(objSociety?._id, {
          name: data.Name,
          address: data.Address,
          authorities: data.Authorities,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstSocieties.refetch();
          setOpen(false);
          reset();
        }
      } else {
        const response = await addSociety({
          name: data.Name,
          address: data.Address,
          authorities: data.Authorities,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstSocieties.refetch();
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
    if (objSociety && isEdit) {
      reset({
        Name: objSociety?.name,
        Authorities:
          objSociety?.authorities?.map((a: any) => ({
            user: a?.user?._id,
          })) || [],
        Address: objSociety?.address,
      });
    }
  }, [objSociety, isEdit, reset]);

  return (
    <div>
      <DataTableLayout
        title="Societies"
        buttonText="Create"
        onButtonClick={() => setOpen(true)}
        rows={lstSocieties?.data?.data?.data || []}
        columns={columns}
        paginationModel={{ page: 0, pageSize: 10 }}
        onRowClick={(params) => router.push(`/main/building/${params.row._id}`)}
      />

      <CommonDialog
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Edit" : "Add"}
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
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
                <Controller
                  name="Authorities"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value?.length > 0 || "At least one authority is required",
                  }}
                  render={({ field }) => {
                    const userList: { _id: string; name: string }[] =
                      lstUser?.data?.data?.data || [];
                    const selectedUsers = field.value?.length
                      ? userList.filter((user) =>
                          field.value.some(
                            (auth: { user: string }) => auth.user === user._id
                          )
                        )
                      : [];
                    return (
                      <Autocomplete
                        multiple
                        options={userList}
                        defaultValue={
                          objSociety?.authorities?.map((a: any) => ({
                            user: a.user.name || a.user._id, // Support both formats
                          })) || []
                        }
                        getOptionLabel={(option) => option.name}
                        value={selectedUsers}
                        onChange={(
                          _,
                          selectedUsers: { _id: string; name: string }[]
                        ) => {
                          const mapped = selectedUsers.map((user) => ({
                            user: user._id,
                          }));
                          field.onChange(mapped);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Authorities"
                            error={!!errors?.Authorities}
                            helperText={errors?.Authorities?.message?.toString()}
                          />
                        )}
                      />
                    );
                  }}
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
    </div>
  );
}
