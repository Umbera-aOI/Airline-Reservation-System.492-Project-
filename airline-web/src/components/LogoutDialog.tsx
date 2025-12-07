import * as React from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Snackbar,
} from '@mui/material';
import {logout} from "@/api/auth.ts";
import {useQueryClient} from "@tanstack/react-query";

export default function LogoutDialog({open, onClose}: { open: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const handleSubmit = async () => {
        logout();
        queryClient.setQueryData(['jwtToken'], null);
        setSnackbarOpen(true);
        onClose();
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Logout</DialogTitle>
            <DialogActions>
                <Button variant={'outlined'} onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleSubmit}>
                    Logout
                </Button>
            </DialogActions>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={'success'}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Logout Successful!
                </Alert>
            </Snackbar>
        </Dialog>
    );
}