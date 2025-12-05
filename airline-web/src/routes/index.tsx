import {type FormEvent, useState} from 'react'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import * as dayjs from 'dayjs'
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from '@mui/material'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

import {
    type Flight,
    type FlightSearchParams,
    searchFlights,
    getOrigins,
    getDestinations,
} from '@/api/flights'
import FlightsTable from "@/components/FlightsTable.tsx";

export const Route = createFileRoute('/')({
    component: FlightsSearchPage,
})

function FlightsSearchPage() {
    const [formValues, setFormValues] = useState<FlightSearchParams>({
        origin: '',
        destination: '',
        date: null,
    })
    const [searchParams, setSearchParams] =
        useState<FlightSearchParams | null>(null)

    const navigate = useNavigate({from: Route.fullPath})

    const flightsQuery = useQuery({
        queryKey: ['flights', searchParams],
        queryFn: () => {
            if (!searchParams) {
                throw new Error('No search params')
            }
            return searchFlights(searchParams)
        },
        enabled: !!searchParams,
    })

    const originsQuery = useQuery({
        queryKey: ['origins'],
        queryFn: () => {
            return getOrigins()
        },
    })

    const destinationsQuery = useQuery({
        queryKey: ['destinations', formValues.origin],
        queryFn: () => {
            return getDestinations(formValues.origin)
        },
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!formValues.origin || !formValues.destination || !formValues.date) {
            return
        }
        setSearchParams(formValues)
    }
    const handleSelectFlight = (flight: Flight) => {
        navigate({
            to: '/flights/$flightId/payment',
            params: {flightId: flight.id.toString()},
        })
    }
    return (
        <Box sx={{maxWidth: 900, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Search Flights
            </Typography>

            <Card sx={{mb: 3}}>
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)'},
                            gap: 2,
                            alignItems: 'flex-end',
                        }}
                    >
                        <Autocomplete
                            value={formValues.origin}
                            loading={originsQuery.isLoading}
                            options={originsQuery.data ?? []}
                            onChange={(_e, value) =>
                                setFormValues((prev) => ({...prev, origin: `${value}`}))
                            }
                            renderInput={(params) => <TextField {...params} label="From" required/>}
                        />
                        <Autocomplete
                            value={formValues.destination}
                            loading={destinationsQuery.isLoading}
                            options={destinationsQuery.data ?? []}
                            onChange={(_e, value) =>
                                setFormValues((prev) => ({...prev, destination: `${value}`}))
                            }
                            renderInput={(params) => <TextField {...params} label="To" required/>}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Date"
                                        value={formValues.date}
                                        disablePast
                                        onChange={(value: dayjs.Dayjs | null) =>
                                            setFormValues((prev) => ({...prev, date: value}))
                                        }
                            />
                        </LocalizationProvider>
                        <Box sx={{gridColumn: {xs: '1 / -1', sm: 'span 2', md: 'span 3'}}}>
                            <Typography variant="body2" sx={{mb: 1}}>
                                Passenger count: 1
                            </Typography>
                            <Button type="submit" variant="contained">
                                Search
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {searchParams &&
                <>
                    {flightsQuery.isLoading && <Typography>Loading flights…</Typography>}
                    {flightsQuery.isError && (
                        <Typography color="error">
                            Failed to load flights. Try again.
                        </Typography>
                    )}
                    {!flightsQuery.isLoading && flightsQuery.data && (
                        <FlightsTable
                            flightData={flightsQuery.data!}
                            handleSelectFlight={handleSelectFlight}
                        />
                    )}
                </>
            }
        </Box>
    )
}
