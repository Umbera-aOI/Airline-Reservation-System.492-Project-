import {useState, type ChangeEvent, type FormEvent} from 'react'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
} from '@mui/material'

export const Route = createFileRoute('/reservations/search')({
    component: ReservationSearchPage,
})

function ReservationSearchPage() {
    const navigate = useNavigate({from: Route.fullPath})

    const [formValues, setFormValues] = useState({
        confirmationCode: '',
        lastName: '',
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, value} = e.target
        setFormValues((prev: any) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        navigate({
            to: '/reservations/$confirmationCode',
            params: {confirmationCode: formValues.confirmationCode},
            search: {lastName: formValues.lastName},
        })
    }

    return (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Find your Reservation
            </Typography>
            <Card>
                <CardContent>
                    <Box
                        component="form"
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Confirmation Code"
                            name="confirmationCode"
                            value={formValues.confirmationCode}
                            onChange={handleChange}
                            inputProps={{maxLength: 5}}
                            required
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}>
                        Find Reservation
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}
