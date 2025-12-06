import {type Flight} from "@/api/flights.ts";
import {Typography, Box} from "@mui/material";
import {type Reservation} from "@/api/reservations.ts";
import ReservationInfo from "@/components/ReservationInfo.tsx";

export default function FlightInfo({flight, reservation}: { flight?: Flight, reservation?: Reservation }) {
    return flight && (
        <Box>
            <ReservationInfo reservation={reservation}/>
            <Typography variant="subtitle1">
                Flight ID: {flight.id}
            </Typography>
            <Typography variant="subtitle1">
                Flight Code: {flight.flightCode}
            </Typography>
            <Typography variant="body2">
                {flight.origin} → {flight.destination}
            </Typography>
            <Typography variant="body2" sx={{mb: 1}}>
                Departure: {flight.departureTime}, Arrival:{' '}
                {flight.arrivalTime}
            </Typography>
            <Typography variant="h6">
                Total (1 passenger): ${flight.price}
            </Typography>
        </Box>
    );
}