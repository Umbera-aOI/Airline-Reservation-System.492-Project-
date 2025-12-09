import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import {useQueryClient} from "@tanstack/react-query";
import {deleteReservation} from "@/api/reservations.ts";

export default function DeleteReservationDialog({onClose, openSnackbar, confirmationCode, lastName}: {
    onClose: () => void,
    openSnackbar: (message: string, severity: "success" | "error") => void,
    confirmationCode: string | null,
    lastName: string,
}) {
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        await deleteReservation(confirmationCode!, lastName)
        openSnackbar('Delete Successful!', 'success');
        onClose();
        await queryClient.invalidateQueries();
    };

    return (
        <Dialog open={!!confirmationCode} onClose={() => onClose()}>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete this reservation? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button variant={'contained'} onClick={handleDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}