import {useState, type ChangeEvent, type FormEvent} from 'react'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material'
import {
    getFlightById,
} from '@/api/flights.ts'
import {
    bookReservation,
    payForFlight,
    type PaymentPayload, type Reservation,
} from '@/api/reservations.ts'
import FlightInfo from "@/components/FlightInfo.tsx";
import {useAuth} from "@/api/auth.ts";

export const Route = createFileRoute('/flights/$flightId/payment')({
    component: FlightPaymentPage,
})

function FlightPaymentPage() {
    const {flightId} = Route.useParams();
    const userData = useAuth();
    const jwtToken = userData?.jwtToken ?? null;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate({from: Route.fullPath});
    const queryClient = useQueryClient();

    const {data: flight, isLoading: isFlightLoading} = useQuery({
        queryKey: ['flight', flightId],
        queryFn: () => getFlightById(+flightId),
    })

    const [formValues, setFormValues] = useState<{
        cardNumber: string,
        nameOnCard: string,
        expiry: string,
        cvv: string,
    }>({
        cardNumber: '',
        nameOnCard: '',
        expiry: '',
        cvv: '',
    })

    const {
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (payload: PaymentPayload) => {
            await payForFlight(payload, jwtToken);
            return await bookReservation({
                flightId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                price: flight!.price
            }, jwtToken);
        },
        onSuccess: (result: Reservation) => {
            const {confirmationCode, lastName} = result;
            queryClient.setQueryData(['reservation', [confirmationCode, lastName]], result);
            return navigate({
                to: '/reservations/$confirmationCode',
                params: {confirmationCode},
                search: {lastName, confirmation: true},
            })
        },
        onError: () => setSnackbarOpen(true),
    })

    const handleCardNumberChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        let value = e.target.value;
        [4, 9, 14].forEach(i => {
            if (value.length > i && value.at(i) != ' ') {
                value = `${value.slice(0, i)} ${value.slice(i, value.length)}`
            }
        });
        setFormValues((prev: any) => ({...prev, cardNumber: value}))
    }


    const handleExpirationChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        let value = e.target.value;
        if (value.length > 2 && value.at(2) != '/') {
            value = `${value.slice(0, 2)}/${value.slice(2, value.length)}`
        }
        setFormValues((prev: any) => ({...prev, expiry: value}))
    }


    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, value} = e.target
        setFormValues((prev: any) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const lastSpace = formValues.nameOnCard.lastIndexOf(' ');
        const firstName = formValues.nameOnCard.slice(0, lastSpace);
        const lastName = formValues.nameOnCard.slice(lastSpace + 1);
        mutate({
            creditCardNumber: formValues.cardNumber,
            firstName,
            lastName,
            expirationDate: formValues.expiry,
            cvv: formValues.cvv,
        });
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                            onChange={handleCardNumberChange}
                            required
                            slotProps={{
                                htmlInput: {
                                    maxLength: 19,
                                    inputMode: 'numeric',
                                    pattern: '\\d{4} \\d{4} \\d{4} \\d{4}'
                                }
                            }}
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
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 5,
                                        inputMode: 'numeric',
                                        pattern: '\\d{2}/\\d{2}'
                                    }
                                }}
                                onChange={handleExpirationChange}
                                required
                            />
                            <TextField
                                label="CVV"
                                name="cvv"
                                value={formValues.cvv}
                                onChange={handleChange}
                                required
                                type="password"
                                slotProps={{htmlInput: {maxLength: 4, inputMode: 'numeric'}}}
                            />
                        </Box>
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
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity='error'
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Payment Failed! Please try again.
                </Alert>
            </Snackbar>
        </Box>
    )
}
