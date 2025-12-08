import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import {useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/api/auth.ts";
import {deleteFlight} from "@/api/flights.ts";

export default function DeleteFlightDialog({onClose, openSnackbar, flightId}: {
    onClose: () => void,
    openSnackbar: (message: string, severity: "success" | "error") => void,
    flightId: number | null
}) {
    const queryClient = useQueryClient();
    const userData = useAuth();

    const handleDelete = async () => {
        await deleteFlight(flightId!, userData!.jwtToken!)
        openSnackbar('Delete Successful!', 'success');
        await queryClient.invalidateQueries();
        onClose();
    };

    return (
        <Dialog open={!!flightId} onClose={() => onClose()}>
            <DialogTitle>Delete Flight</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete this flight? This action cannot be undone.
                    This will also delete all reservations associated with this flight.
                    Agents will be notified of the deletion.
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