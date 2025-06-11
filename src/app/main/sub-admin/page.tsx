"use client";
import CommonDialog from "@/common/CommonDialog";
import DataTableLayout from "@/common/DataTableLayout";
import { showError, showSuccess } from "@/components/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import { addRole, deleteRole, editRole } from "../role/actions";
import { listOfSocieties } from "../socities/actions";
import { listSubAdmin } from "./actions";

const roleSchema = yup.object({
  name: yup.string().required("Name is required"),
  heightId: yup.string().required("Society is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\+?\d{10,15}$/, "Phone number is not valid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Page() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objAuthorities, setObjAuthorities] = useState<any>();
  const router = useRouter();

  const lstSubAdmin = useQuery({
    queryKey: ["lstSubAdmin"],
    queryFn: async () => await listSubAdmin(),
  });
  const lstSocieties = useQuery({
    queryKey: ["LstSocieties"],
    queryFn: async () => await listOfSocieties(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: {},
  });

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 170 },
    {
      field: "heaightID",
      headerName: "Heaight",
      flex: 1,
      renderCell: ({ row }) => row.heaightID?.name,
    },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "password", headerName: "Password", flex: 1 },

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
              setObjAuthorities(row);
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
                  await deleteRole(row._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "The item has been successfully deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  lstSubAdmin.refetch();
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
  const handleclose = () => {
    setOpen(false);
    reset({
      email: "",
      name: "",
      password: "",
      phone: "",
      heightId: "",
    });
    setIsEdit(false);
    setObjAuthorities(undefined);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objAuthorities?._id) {
        const response = await editRole(objAuthorities?._id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "SUB_ADMIN",
          heaightID: data.heightId,
          password: data.password,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstSubAdmin.refetch();
          handleclose();
        }
      } else {
        const response = await addRole({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "SUB_ADMIN",
          heaightID: data.heightId,
          password: data.password,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstSubAdmin.refetch();
          handleclose();
        }
      }
    } catch (err: any) {
      showError(err?.response?.data?.message);
      handleclose();
    }
  };

  useEffect(() => {
    if (objAuthorities !== undefined && isEdit) {
      reset({
        name: objAuthorities?.name,
        email: objAuthorities.email,
        phone: objAuthorities.phone,
        password: objAuthorities?.password,
        heightId: objAuthorities?.heaightID?._id,
      });
    }
  }, [objAuthorities, isEdit]);

  return (
    <div>
      <DataTableLayout
        title="Sub Admin"
        buttonText="Create"
        onButtonClick={() => setOpen(true)}
        rows={lstSubAdmin?.data?.data?.data || []}
        columns={columns}
        paginationModel={{ page: 0, pageSize: 10 }}
      />
      <CommonDialog
        open={open}
        onClose={handleclose}
        title={isEdit ? "Edit" : "Add"}
        maxWidth={"lg"}
        content={
          <form id="society-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 6, md: 4 }}>
                <FormControl fullWidth error={!!errors.heightId}>
                  <InputLabel id="demo-simple-select-label">Heights</InputLabel>
                  <Controller
                    name="heightId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        labelId="height-select-label"
                        label="Heights"
                        {...field}
                      >
                        {lstSocieties?.data?.data?.data?.map(
                          (height: { name: string; _id: string }) => (
                            <MenuItem key={height._id} value={height._id}>
                              {height.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  {errors.heightId && (
                    <FormHelperText>{errors.heightId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                  id="outlined-multiline-static"
                  label="Phone"
                  fullWidth
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                  id="outlined-multiline-static"
                  label="Password"
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
            </Grid>
          </form>
        }
        actions={
          <>
            <Button onClick={handleclose}>Cancel</Button>
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
