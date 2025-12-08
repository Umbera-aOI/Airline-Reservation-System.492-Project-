import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import {logout} from "@/api/auth.ts";
import {useQueryClient} from "@tanstack/react-query";

export default function LogoutDialog({open, onClose, openSnackbar}: {
    open: boolean,
    onClose: () => void,
    openSnackbar: (message: string, severity: "success" | "error") => void
}) {
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        logout();
        queryClient.setQueryData(['jwtToken'], null);
        openSnackbar('Logout Successful!', 'success');
        onClose();
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle>Logout</DialogTitle>
            <DialogActions>
                <Button variant={'outlined'} onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleSubmit}>
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
}