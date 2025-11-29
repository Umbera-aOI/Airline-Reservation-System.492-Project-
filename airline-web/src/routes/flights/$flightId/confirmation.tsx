import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material'
import { getFlightById } from '@/api/flights'

export const Route = createFileRoute(
    '/flights/$flightId/confirmation'
)({
    component: FlightConfirmationPage,
})

function FlightConfirmationPage() {
    const { flightId } = Route.useParams()
    const search = Route.useSearch() as { confirmationId?: string }
    const navigate = useNavigate({ from: Route.fullPath })

    const { data: flight } = useQuery({
        queryKey: ['flight', flightId],
        queryFn: () => getFlightById(flightId),
    })

    const handleBackToSearch = () => {
        navigate({ to: '/' })
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Booking Confirmed
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Thank you for your purchase!
                    </Typography>

                    {search.confirmationId && (
                        <Typography sx={{ mb: 2 }}>
                            Confirmation ID:{' '}
                            <strong>{search.confirmationId}</strong>
                        </Typography>
                    )}

                    {flight && (
                        <>
                            <Typography>
                                Flight: {flight.origin} → {flight.destination}
                            </Typography>
                            <Typography>Airline: {flight.airline}</Typography>
                            <Typography>
                                Departure: {flight.departureTime}, Arrival:{' '}
                                {flight.arrivalTime}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Total paid (1 passenger): ${flight.price}
                            </Typography>
                        </>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" onClick={handleBackToSearch}>
                            Back to search
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
