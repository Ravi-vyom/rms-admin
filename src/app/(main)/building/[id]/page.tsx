"use client"
import CommonDialog from "@/common/CommonDialog";
import TitleWithButton from "@/common/TitleWithButton";
import { showError, showSuccess } from "@/components/utils/toast";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, Button, Chip, Grid, IconButton, Paper, TextField } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { addBuilding, editBuilding, listOfBuilding } from "../actions";

const columns: GridColDef[] = [
    { field: 'heaight', headerName: 'Heaight', renderCell: ({ row }) => row?.heaight?.name },
    { field: 'buildingName', headerName: 'Building Name', width: 160 },
    {
        field: 'authorities',
        headerName: 'Authorities',
        flex: 1,
        renderCell: ({ row }) => (
            row?.heaight?.authorities?.map((auth: any, index: number) => (
                <Chip key={index} label={auth?.user?.name} size="small" color="primary" />
            ))
        )
    },
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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [objBuilding, setBuilding] = useState<any>()
    const router = useRouter()
    const { id } = use(params);
    console.log(id)
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            Name: "",
        },
    });

    const lstBilding = useQuery({
        queryKey: ["LstBuilding"],
        queryFn: async () => await listOfBuilding()
    })

    const onSubmit = async (data: any) => {
        try {
            if (isEdit && objBuilding?._id) {
                const response = await editBuilding(objBuilding?._id, {
                    buildingName: data.Name,
                    heaight: id
                })
                if (response.data.status === true) {
                    showSuccess(response?.data?.message)
                    lstBilding.refetch()
                    setOpen(false)
                    reset()
                }

            } else {
                const response = await addBuilding({
                    buildingName: data.Name,
                    heaight: id
                })
                if (response.data.status === true) {
                    showSuccess(response?.data?.message)
                    lstBilding.refetch()
                    setOpen(false)
                    reset()
                }
            }
        } catch (err: any) {
            showError(err?.response?.data?.message)
            setOpen(false)
        }
    };

    return (
        <>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3
            }}>
                <div style={{
                    width: "92%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 17
                }}>
                    <TitleWithButton title="Building" buttonText="Create" onClick={() => setOpen(true)} />
                    <Paper elevation={5} sx={{ height: "100%", marginBottom: 2, borderRadius: 5, overflow: "hidden", py: 2 }}>
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
                                router.push(`/flour/${params.row.id}`);
                            }}
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
                dialogProps={{
                    maxWidth: "sm",
                }}
                onClose={() => setOpen(false)}
                title="Add New Building"
                content={
                    <form id="society-form" onSubmit={handleSubmit(onSubmit)}>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <TextField label="Name" variant="outlined" fullWidth
                                    {...register("Name", { required: "Name is required" })}
                                    error={!!errors.Name}
                                    helperText={errors.Name?.message}
                                />
                            </Grid>
                        </Grid>
                    </form>
                }
                actions={
                    <>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="contained" form="society-form" color="primary" type="submit">
                            Save
                        </Button>
                    </>
                }
            />
        </>
    )
}
