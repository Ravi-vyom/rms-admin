"use client"
import TitleWithButton from '@/common/TitleWithButton';
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, IconButton, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { getRoles } from '../role/actions';

const paginationModel = { page: 0, pageSize: 5 };

export default function Page() {

    const lstRole = useQuery({
        queryKey: ["lstRole"],
        queryFn: async () => await getRoles(),
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
                            // setOpen(true);
                            // setIsEdit(true);
                            // setObjRole(row);
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
                                    // await deleteRole(row._id);
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
    return (
        <div>
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
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 17,
                    }}
                >
                    <TitleWithButton
                        title="Authorities"
                        buttonText="Create"
                    // onClick={() => setOpen(true)}
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
                            rows={lstRole.data?.data?.data}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection={false}
                            onRowClick={(params) => {
                                // router.push(`/main/building/${params.row._id}`);
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
                                cursor: "pointer",
                            }}
                        />
                    </Paper>
                </div>
            </Box>
        </div>
    )
}
