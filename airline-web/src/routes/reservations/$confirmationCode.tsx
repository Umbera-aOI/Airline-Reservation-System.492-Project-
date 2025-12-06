import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material'
import {getFlightById} from '@/api/flights.ts'
import {getReservation} from '@/api/reservations.ts'
import FlightInfo from "@/components/FlightInfo.tsx";

export const Route = createFileRoute(
    '/reservations/$confirmationCode'
)({
    component: FlightConfirmationPage,
})

function FlightConfirmationPage() {
    const {confirmationCode} = Route.useParams()
    const search = Route.useSearch() as { lastName: string, confirmation?: string }
    const navigate = useNavigate({from: Route.fullPath})

    const {data: reservation, isError, isLoading} = useQuery({
        queryKey: ['reservation', confirmationCode, search.lastName],
        queryFn: () => getReservation(confirmationCode, search.lastName),
    })

    const {data: flight} = useQuery({
        queryKey: ['flight', reservation?.flightId],
        queryFn: () => getFlightById(reservation!.flightId),
        enabled: !!reservation
    })

    const handleBackToSearch = () => {
        navigate({to: '/'})
    }

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            {
                isLoading && <Typography variant="h4">Loading... <CircularProgress/></Typography>
            }
            {
                !isLoading && isError && <Typography variant="h4">Reservation Not Found</Typography>
            }
            {
                !isLoading && !isError && reservation &&
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Booking Confirmed
                    </Typography>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Thank you for your purchase!
                            </Typography>
                            <FlightInfo flight={flight} reservation={reservation}/>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={handleBackToSearch}>
                                Back to search
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            }
        </Box>
    )
}
