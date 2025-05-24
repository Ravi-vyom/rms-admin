"use client"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import { Card, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginAdmin } from './actions';
import { showError, showSuccess } from '@/components/utils/toast';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie"
const schema = yup
    .object({
        phone: yup
            .string()
            .required('Phone number is required')
            .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits'),
        password: yup.string().required("Password is required field"),
    })
    .required()


export default function Page() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [loading, setLoading] = useState(false)

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLoadingON = () => {
        setLoading(true)
    }

    const handleLoadingOFF = () => {
        setLoading(false)
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            phone: "",
            password: "",
        },
    });
    const onSubmit = async (data: any) => {
        try {
            handleLoadingON()
            const response = await loginAdmin(data)
            if (response?.data?.status === true) {
                handleLoadingOFF()
                // localStorage.setItem("token", response?.data?.token)
                Cookies.set('token', response?.data?.token)
                showSuccess(response?.data?.message)
                router.push("/")
            }
        } catch (err: any) {
            handleLoadingOFF()
            showError(err?.response?.data?.message)
        }
    }
    console.log(errors)
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Paper elevation={5} sx={{
                minWidth: 500,

            }}>
                <Card sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    p: 5
                }}>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign in
                    </Typography>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 25,
                        }}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 25
                        }}>

                            <TextField id="outlined-basic" fullWidth label="Phone Number" variant="outlined" {...register("phone")} error={!!errors.phone} helperText={errors.phone ? errors.phone.message : ""} />
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password" error={!!errors.password}>Password</InputLabel>
                                <OutlinedInput id="outlined-adornment-password" type={showPassword ? "text" : "password"} fullWidth label="Password" error={!!errors.password}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                                sx={{
                                                    color: errors.password ? "#d32f2f" : ""
                                                }}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    {...register("password")} />
                                <FormHelperText sx={{ color: "#d32f2f" }}>
                                    {errors.password &&
                                        errors.password.message
                                    }
                                </FormHelperText>
                            </FormControl>

                        </div>

                        <Button
                            endIcon={<LoginIcon />}
                            loading={loading}
                            loadingPosition="start"
                            variant="contained"
                            type='submit'
                        >
                            SignIn
                        </Button>

                    </form>

                </Card>
            </Paper >
        </div>
    )
}
