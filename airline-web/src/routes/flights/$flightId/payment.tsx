import {useState, type ChangeEvent, type FormEvent} from 'react'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material'
import {
    getFlightById,
} from '@/api/flights.ts'
import {
    payForFlight,
    type PaymentPayload, type Reservation,
} from '@/api/reservations.ts'
import FlightInfo from "@/components/FlightInfo.tsx";

export const Route = createFileRoute('/flights/$flightId/payment')({
    component: FlightPaymentPage,
    loader: ({context}) => context.queryClient.getQueryData(['jwtToken']),
})

function FlightPaymentPage() {
    const {flightId} = Route.useParams()
    const jwtToken = Route.useLoaderData()
    const navigate = useNavigate({from: Route.fullPath})
    const queryClient = useQueryClient();

    const {data: flight, isLoading: isFlightLoading} = useQuery({
        queryKey: ['flight', flightId],
        queryFn: () => getFlightById(+flightId),
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
            const lastSpace = payload.nameOnCard.lastIndexOf(' ');
            const firstName = payload.nameOnCard.slice(0, lastSpace);
            const lastName = payload.nameOnCard.slice(lastSpace + 1);
            return payForFlight({flightId, firstName, lastName}, jwtToken);
        },
        onSuccess: (result: Reservation) => {
            const {confirmationCode, lastName} = result;
            queryClient.setQueryData(['reservation', [confirmationCode, lastName]], result);
            navigate({
                to: '/reservations/$confirmationCode',
                params: {confirmationCode},
                search: {lastName, confirmation: true},
            })
        },
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, value} = e.target
        setFormValues((prev: any) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        mutate(formValues);
    }

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Payment
            </Typography>

            <Card sx={{mb: 3}}>
                <CardContent>
                    {isFlightLoading ? <Typography>Loading flight…</Typography>
                        :
                        <FlightInfo flight={flight!}/>}
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Box
                        component="form"
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
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={16}/> : undefined}
                    >
                        {isPending ? 'Processing…' : 'Pay Now'}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
