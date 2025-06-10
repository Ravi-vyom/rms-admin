"use client";
import CommonDialog from "@/common/CommonDialog";
import InputFileUpload from "@/common/InputFileUpload";
import TitleWithButton from "@/common/TitleWithButton";
import { showError, showSuccess } from "@/components/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import {
  addRole,
  deleteRole,
  editRole,
  getRoles,
  uploadedImage,
} from "../role/actions";
import { listOfSocieties } from "../socities/actions";
import { listAuthorities } from "./actions";
import DataTableLayout from "@/common/DataTableLayout";

const roleSchema = yup.object({
  name: yup.string().required("Name is required"),
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
  profile_pic: yup
    .mixed<File | string>()
    .required("Image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});
const paginationModel = { page: 0, pageSize: 5 };

export default function Page() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objAuthorities, setObjAuthorities] = useState<any>();
  const router = useRouter();

  const lstAuthorities = useQuery({
    queryKey: ["lstAuthorities"],
    queryFn: async () => await listAuthorities(),
  });
  console.log(lstAuthorities.data);
  const lstSocieties = useQuery({
    queryKey: ["LstSocieties"],
    queryFn: async () => await listOfSocieties(),
  });

  const lstRole = useQuery({
    queryKey: ["lstRole"],
    queryFn: async () => await getRoles(),
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
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },

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
                  lstAuthorities.refetch();
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
    });
    setIsEdit(false);
    setObjAuthorities(undefined);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objAuthorities?._id) {
        var result: any;
        if (
          objAuthorities?.profile_pic?.id &&
          data.profile_pic instanceof File
        ) {
          const formData = new FormData();
          formData.append("image", data.profile_pic);
          formData.append("oldImageId", objAuthorities.profile_pic.id);
          await uploadedImage(formData);
        }

        const response = await editRole(objAuthorities?._id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "HEAD",
          password: data.password,
          profile_pic: result?.data?.data?.id
            ? {
                id: result?.data?.data.id,
                image: result?.data?.data.url,
              }
            : objAuthorities?.profile_pic,
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstRole.refetch();
          handleclose();
        }
      } else {
        const formData = new FormData();
        formData.append("image", data.profile_pic);
        const result = await uploadedImage(formData);
        const response = await addRole({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "HEAD",
          password: data.password,
          profile_pic: {
            id: result.data.data.id,
            image: result.data.data.url,
          },
        });
        if (response.data.status === true) {
          showSuccess(response?.data?.message);
          lstRole.refetch();
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
        profile_pic: objAuthorities?.profile_pic?.image,
      });
    }
  }, [objAuthorities, isEdit]);

  return (
    <div>
      <DataTableLayout
        title="Authorities"
        buttonText="Create"
        onButtonClick={() => setOpen(true)}
        rows={lstAuthorities?.data?.data?.data || []}
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

              <Grid size={{ xs: 6, md: 4 }}>
                <Controller
                  name="profile_pic"
                  control={control}
                  render={({ field }) => (
                    <InputFileUpload
                      name="Profile Picture"
                      value={field.value}
                      onChange={field.onChange}
                      defaultImage={objAuthorities?.profile_pic?.image}
                    />
                  )}
                />
                {errors.profile_pic && (
                  <FormHelperText error>
                    {errors.profile_pic.message}
                  </FormHelperText>
                )}
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
