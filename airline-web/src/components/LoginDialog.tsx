import * as React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import type {ChangeEvent} from "react";
import {login} from "@/api/auth.ts";

export default function LoginDialog({open, onClose, openSnackbar}: {
    open: boolean,
    onClose: () => void,
    openSnackbar: (message: string, severity: "success" | "error") => void
}) {
    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, value} = e.target
        setFormData((prev: any) => ({...prev, [name]: value}))
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(formData.username, formData.password);
            handleSuccess();
        } catch (e) {
            handleFail();
        }
    };

    const handleSuccess = () => {
        openSnackbar('Login Successful!', 'success');
        onClose();
    }

    const handleFail = () => {
        openSnackbar('Login failed. Please try again.', 'error');
    }

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <Box
                    id="login-form"
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <TextField
                        autoFocus
                        required
                        value={formData.username}
                        margin="dense"
                        id="username"
                        name="username"
                        label="Username"
                        variant="standard"
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        required
                        value={formData.password}
                        margin="dense"
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        variant="standard"
                        onChange={handleChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button type="submit" form="login-form">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}