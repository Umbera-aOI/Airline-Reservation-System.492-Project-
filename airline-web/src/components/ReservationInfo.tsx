import {Typography, Box, Divider, Button, Snackbar, Alert, Grid} from "@mui/material";
import {type Reservation} from "@/api/reservations.ts";
import {useState} from "react";
import {useRouter} from "@tanstack/react-router";
import DeleteReservationDialog from "@/components/DeleteReservationDialog.tsx";

export default function ReservationInfo({reservation}: { reservation?: Reservation }) {
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const handleClickDeleteReservation = () => {
        setConfirmationCode(reservation!.confirmationCode);
    }

    const handleOpenSnackbar = () => {
        setSnackbarOpen(true);
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        router.navigate({to: '/'});
    }

    const handleCloseDeleteReservationConfirmation = () => {
        setConfirmationCode(null);
    }
    return reservation && (
        <Box>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Typography variant="subtitle1">
                        Confirmation Code: {reservation.confirmationCode}
                    </Typography>
                    <Typography variant="body2">
                        Name: {reservation.firstName} {reservation.lastName}
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Button color='error' variant='contained'
                            onClick={handleClickDeleteReservation}>
                        Delete Reservation
                    </Button>
                </Grid>
            </Grid>
            <Divider/>
            <DeleteReservationDialog onClose={handleCloseDeleteReservationConfirmation}
                                     openSnackbar={handleOpenSnackbar}
                                     confirmationCode={confirmationCode} lastName={reservation.lastName!}/>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity='success'
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Delete Reservation Successful
                </Alert>
            </Snackbar>
        </Box>
    );
}