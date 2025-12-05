import {useState, type ChangeEvent, type FormEvent} from 'react'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material'
import {
    getFlightById,
    payForFlight,
    type PaymentPayload,
} from '@/api/flights.ts'

export const Route = createFileRoute('/flights/$flightId/payment')({
    component: FlightPaymentPage,
})

function FlightPaymentPage() {
    const {flightId} = Route.useParams()
    const navigate = useNavigate({from: Route.fullPath})
    const queryClient = useQueryClient()

    const {data: flight, isLoading: isFlightLoading} = useQuery({
        queryKey: ['flight', flightId],
        queryFn: () => getFlightById(flightId),
    })

    const [formValues, setFormValues] = useState<PaymentPayload>({
        cardNumber: '',
        nameOnCard: '',
        expiry: '',
        cvv: '',
    })

    const {
        mutate,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: PaymentPayload) => {
            const [firstName, lastName] = payload.nameOnCard.split(' ');
            return payForFlight({flightId, firstName, lastName});
        },
        onSuccess: (result) => {
            // Optionally refresh any related queries
            queryClient.invalidateQueries({queryKey: ['flight', flightId]})

            navigate({
                to: '/flights/$flightId/confirmation',
                params: {flightId},
                search: {confirmationCode: result.confirmationCode},
            })
        },
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, value} = e.target
        setFormValues((prev: any) => ({...prev, [name]: value}))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutate(formValues)
    }

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Payment
            </Typography>

            <Card sx={{mb: 3}}>
                <CardContent>
                    {isFlightLoading && <Typography>Loading flight…</Typography>}
                    {flight && (
                        <>
                            <Typography variant="subtitle1">
                                Flight ID: {flight.id}
                            </Typography>
                            <Typography variant="subtitle1">
                                Flight Code: {flight.flightCode}
                            </Typography>
                            <Typography variant="body2">
                                {flight.origin} → {flight.destination}
                            </Typography>
                            <Typography variant="body2">
                                Airline: {flight.airline}
                            </Typography>
                            <Typography variant="body2" sx={{mb: 1}}>
                                Departure: {flight.departureTime}, Arrival:{' '}
                                {flight.arrivalTime}
                            </Typography>
                            <Typography variant="h6">
                                Total (1 passenger): ${flight.price}
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <TextField
                            label="Card Number"
                            name="cardNumber"
                            value={formValues.cardNumber}
                            onChange={handleChange}
                            required
                            inputProps={{maxLength: 19}}
                            placeholder="**** **** **** ****"
                        />
                        <TextField
                            label="Name on Card"
                            name="nameOnCard"
                            value={formValues.nameOnCard}
                            onChange={handleChange}
                            required
                        />
                        <Box sx={{display: 'flex', gap: 2}}>
                            <TextField
                                label="Expiry (MM/YY)"
                                name="expiry"
                                value={formValues.expiry}
                                inputProps={{maxLength: 4}}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                label="CVV"
                                name="cvv"
                                value={formValues.cvv}
                                onChange={handleChange}
                                required
                                type="password"
                                inputProps={{maxLength: 4}}
                            />
                        </Box>

                        {isError && (
                            <Typography color="error">
                                {(error as Error)?.message ?? 'Payment failed'}
                            </Typography>
                        )}

                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending}
                                startIcon={isPending ? <CircularProgress size={16}/> : undefined}
                            >
                                {isPending ? 'Processing…' : 'Pay Now'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
