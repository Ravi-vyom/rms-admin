"use client";
import CommonDialog from "@/common/CommonDialog";
import TitleWithButton from "@/common/TitleWithButton";
import { showError, showSuccess } from "@/components/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import { listOfSocieties } from "../socities/actions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  addRole,
  deleteRole,
  editRole,
  getRoles,
  uploadedImage,
} from "./actions";
import InputFileUpload from "@/common/InputFileUpload";
import { FieldError } from "react-hook-form";
import DataTableLayout from "@/common/DataTableLayout";

const paginationModel = { page: 0, pageSize: 5 };
const roleSchema = yup.object({
  heightId: yup.string().required("Height is required"),
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
  role: yup.string().required("Role is required"),
  profile_pic: yup
    .mixed<File | string>()
    .required("Image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
  familyMembers: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      relation: yup.string().required("Relation is required"),
      age: yup
        .number()
        .required("Age is required")
        .positive("Age must be positive")
        .integer("Age must be a number"),
      occupation: yup.string().required("Occupation is required"),
      contactNo: yup
        .string()
        .required("Contact is required")
        .matches(/^\+?\d{10,15}$/, "Invalid contact number"),
    })
  ),
  businessDetail: yup
    .array()
    .of(
      yup.object({
        businessName: yup.string().required("Business Name is required"),
        type: yup.string().required("Type is required"),
        ownerName: yup.string().required("Owner Name is required"),
        address: yup.string().required("Address is required"),
        contactNo: yup
          .string()
          .required("Contact No is required")
          .matches(/^\d{10}$/, "Contact No must be a valid 10-digit number"),
        gstNo: yup
          .string()
          .required("GST No is required")
          .matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Invalid GST No format"
          ),
      })
    )
    .min(1, "At least one business detail is required"),
  vehicle: yup.array().of(
    yup.object({
      vehicleType: yup.string().required("Vehicle type is required"),
      vehicleNo: yup
        .string()
        .required("Vehicle number is required")
        .matches(
          /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
          "Invalid vehicle number"
        ),
    })
  ),
});

const getErrorMessage = (
  error: FieldError | string | undefined
): string | undefined => {
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as FieldError).message;
  }
  return undefined;
};
export default function Page() {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [objRole, setObjRole] = useState<any>();
  const router = useRouter();

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
              setObjRole(row);
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
                  lstRole.refetch();
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
    resolver: yupResolver(roleSchema),
    defaultValues: {
      familyMembers: [
        { name: "", relation: "", age: 0, occupation: "", contactNo: "" },
      ],
      businessDetail: [
        {
          businessName: "",
          type: "",
          ownerName: "",
          address: "",
          contactNo: "",
          gstNo: "",
        },
      ],
      vehicle: [{ vehicleType: "", vehicleNo: "" }],
    },
  });

  const {
    fields: familyFields,
    append: appendFamily,
    remove: removeFamily,
  } = useFieldArray({
    control,
    name: "familyMembers",
  });
  const {
    fields: businessFields,
    append: appendBusiness,
    remove: removeBusiness,
  } = useFieldArray({
    control,
    name: "businessDetail",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicle",
  });

  const handleclose = () => {
    setOpen(false);
    reset({
      email: "",
      heightId: "",
      name: "",
      password: "",
      phone: "",
    });
    setIsEdit(false);
    setObjRole(undefined);
  };

  const lstSocieties = useQuery({
    queryKey: ["LstSocieties"],
    queryFn: async () => await listOfSocieties(),
  });

  const lstRole = useQuery({
    queryKey: ["lstRole"],
    queryFn: async () => await getRoles(),
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && objRole?._id) {
        var result: any;
        if (objRole?.profile_pic?.id && data.profile_pic instanceof File) {
          const formData = new FormData();
          formData.append("image", data.profile_pic);
          formData.append("oldImageId", objRole.profile_pic.id);
          await uploadedImage(formData);
        }

        const response = await editRole(objRole?._id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          password: data.password,
          heaightID: data.heightId,
          profile_pic: result?.data?.data?.id
            ? {
                id: result?.data?.data.id,
                image: result?.data?.data.url,
              }
            : objRole?.profile_pic,
          familyMembers: data.familyMembers,
          businessDetails: data.businessDetail,
          vehicleDetails: data.vehicle,
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
          role: data.role,
          password: data.password,
          heaightID: data.heightId,
          profile_pic: {
            id: result.data.data.id,
            image: result.data.data.url,
          },
          familyMembers: data.familyMembers,
          businessDetails: data.businessDetail,
          vehicleDetails: data.vehicle,
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
    if (objRole !== undefined && isEdit) {
      reset({
        name: objRole?.name,
        email: objRole.email,
        phone: objRole.phone,
        password: objRole?.password,
        heightId: objRole?.heaightID?._id,
        role: objRole?.role,
        familyMembers: objRole?.familyMembers.map((item: any) => item),
        businessDetail: objRole?.businessDetails.map((item: any) => item),
        vehicle: objRole?.vehicleDetails.map((item: any) => item),
        profile_pic: objRole?.profile_pic?.image,
      });
    }
  }, [objRole, isEdit]);

  return (
    <div>
      <DataTableLayout
        title="Assign Role"
        buttonText="Create"
        onButtonClick={() => setOpen(true)}
        rows={lstRole?.data?.data?.data || []}
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
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        labelId="role-select-label"
                        id="role-select"
                        label="Role"
                        {...field}
                      >
                        <MenuItem value={"PRAMUKH"}>Pramukh</MenuItem>
                        <MenuItem value={"USER"}>USER</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
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
              <Grid size={{ xs: 6, md: 12 }} spacing={2}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6">Family Member</Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      appendFamily({
                        name: "",
                        relation: "",
                        age: 0,
                        occupation: "",
                        contactNo: "",
                      })
                    }
                  >
                    + Add Member
                  </Button>
                </div>
                {familyFields.map((item, index) => (
                  <div key={item.id}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Name"
                          {...register(`familyMembers.${index}.name`)}
                          error={!!errors.familyMembers?.[index]?.name}
                          helperText={
                            errors.familyMembers?.[index]?.name?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Relation"
                          {...register(`familyMembers.${index}.relation`)}
                          error={!!errors.familyMembers?.[index]?.relation}
                          helperText={
                            errors.familyMembers?.[index]?.relation?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Age"
                          type="number"
                          {...register(`familyMembers.${index}.age`)}
                          error={!!errors.familyMembers?.[index]?.age}
                          helperText={
                            errors.familyMembers?.[index]?.age?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Occupation"
                          {...register(`familyMembers.${index}.occupation`)}
                          error={!!errors.familyMembers?.[index]?.occupation}
                          helperText={
                            errors.familyMembers?.[index]?.occupation?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Contact No"
                          {...register(`familyMembers.${index}.contactNo`)}
                          error={!!errors.familyMembers?.[index]?.contactNo}
                          helperText={
                            errors.familyMembers?.[index]?.contactNo?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <IconButton
                          color="error"
                          onClick={() => removeFamily(index)}
                          aria-label="delete family member"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
              <Grid size={{ xs: 6, md: 12 }} spacing={2}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6">Bussiness Details</Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      appendBusiness({
                        businessName: "",
                        address: "",
                        contactNo: "",
                        gstNo: "",
                        ownerName: "",
                        type: "",
                      })
                    }
                  >
                    + Add Bussiness
                  </Button>
                </div>
                {businessFields.map((item, index) => (
                  <div key={item.id}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Bussiness Name"
                          {...register(`businessDetail.${index}.businessName`)}
                          error={!!errors.businessDetail?.[index]?.businessName}
                          helperText={
                            errors.businessDetail?.[index]?.businessName
                              ?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Type"
                          type="text"
                          {...register(`businessDetail.${index}.type`)}
                          error={!!errors.businessDetail?.[index]?.type}
                          helperText={getErrorMessage(
                            errors.businessDetail?.[index]?.type
                          )}
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Owner Name"
                          type="text"
                          {...register(`businessDetail.${index}.ownerName`)}
                          error={!!errors.businessDetail?.[index]?.ownerName}
                          helperText={
                            errors.businessDetail?.[index]?.ownerName?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Address"
                          {...register(`businessDetail.${index}.address`)}
                          error={!!errors.businessDetail?.[index]?.address}
                          helperText={
                            errors.businessDetail?.[index]?.address?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="Contact No"
                          {...register(`businessDetail.${index}.contactNo`)}
                          error={!!errors.businessDetail?.[index]?.contactNo}
                          helperText={
                            errors.businessDetail?.[index]?.contactNo?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                          label="GST No."
                          {...register(`businessDetail.${index}.gstNo`)}
                          error={!!errors.businessDetail?.[index]?.gstNo}
                          helperText={
                            errors.businessDetail?.[index]?.gstNo?.message
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <IconButton
                          color="error"
                          onClick={() => removeFamily(index)}
                          aria-label="delete family member"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
              <Grid size={{ xs: 6, md: 12 }} spacing={2}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6">Vehical Details</Typography>
                </div>
                {fields.map((item, index) => (
                  <Grid key={index} container spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Vehicle Type"
                        fullWidth
                        {...register(`vehicle.${index}.vehicleType`)}
                        error={!!errors.vehicle?.[index]?.vehicleType}
                        helperText={
                          errors.vehicle?.[index]?.vehicleType?.message
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <TextField
                        label="Vehicle No"
                        fullWidth
                        {...register(`vehicle.${index}.vehicleNo`)}
                        error={!!errors.vehicle?.[index]?.vehicleNo}
                        helperText={errors.vehicle?.[index]?.vehicleNo?.message}
                      />
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          append({ vehicleType: "", vehicleNo: "" })
                        }
                        disabled={index !== fields.length - 1}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        aria-label="delete family member"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
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
                      defaultImage={objRole?.profile_pic?.image}
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
