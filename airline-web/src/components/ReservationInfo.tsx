import {Typography, Box, Divider} from "@mui/material";
import {type Reservation} from "@/api/reservations.ts";

export default function ReservationInfo({reservation}: { reservation?: Reservation }) {
    return reservation && (
        <Box>
            <Typography variant="subtitle1">
                Confirmation Code: {reservation.confirmationCode}
            </Typography>
            <Typography variant="body2">
                Name: {reservation.firstName} {reservation.lastName}
            </Typography>
            <Divider/>
        </Box>
    );
}