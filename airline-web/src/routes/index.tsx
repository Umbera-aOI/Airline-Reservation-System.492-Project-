import { type FormEvent, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import * as dayjs from 'dayjs'
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
    type Flight,
    type FlightSearchParams,
    searchFlights,
    getCities
} from '@/api/flights'

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

    const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all')
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
    const [airlineFilter, setAirlineFilter] = useState<string>('all')

    const navigate = useNavigate({ from: Route.fullPath })

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

    const citiesQuery = useQuery({
        queryKey: ['cities'],
        queryFn: () => {
            return getCities()
        },
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!formValues.origin || !formValues.destination || !formValues.date) {
            return
        }
        setSearchParams(formValues)
    }

    const handleTimeFilterChange = (e: SelectChangeEvent) => {
        setTimeFilter(e.target.value as typeof timeFilter)
    }

    const handlePriceFilterChange = (e: SelectChangeEvent) => {
        setPriceFilter(e.target.value as typeof priceFilter)
    }

    const handleAirlineFilterChange = (e: SelectChangeEvent) => {
        setAirlineFilter(e.target.value)
    }

    const handleSelectFlight = (flight: Flight) => {
        navigate({
            to: '/flights/$flightId/payment',
            params: { flightId: flight.id },
        })
    }

    const filteredFlights: Flight[] = useMemo(() => {
        if (!flightsQuery.data) return []

        return flightsQuery.data.filter((flight) => {
            // Time filter
            if (timeFilter !== 'all') {
                const hour = parseInt(flight.departureTime.split(':')[0], 10)
                const isMorning = hour >= 5 && hour < 12
                const isAfternoon = hour >= 12 && hour < 17
                const isEvening = hour >= 17 || hour < 5

                if (
                    (timeFilter === 'morning' && !isMorning) ||
                    (timeFilter === 'afternoon' && !isAfternoon) ||
                    (timeFilter === 'evening' && !isEvening)
                ) {
                    return false
                }
            }

            // Price filter
            if (priceFilter !== 'all') {
                const p = flight.price
                const inLow = p < 150
                const inMedium = p >= 150 && p < 250
                const inHigh = p >= 250

                if (
                    (priceFilter === 'low' && !inLow) ||
                    (priceFilter === 'medium' && !inMedium) ||
                    (priceFilter === 'high' && !inHigh)
                ) {
                    return false
                }
            }

            // Airline filter
            return !(airlineFilter !== 'all' && flight.airline !== airlineFilter);


        })
    }, [flightsQuery.data, timeFilter, priceFilter, airlineFilter])

    const airlineOptions = useMemo(() => {
        if (!flightsQuery.data) return []
        const set = new Set(flightsQuery.data.map((f) => f.airline))
        return Array.from(set)
    }, [flightsQuery.data])

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search Flights
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                            gap: 2,
                            alignItems: 'flex-end',
                        }}
                    >
                        <Autocomplete
                            value={formValues.origin}
                            loading={citiesQuery.isLoading}
                            options={citiesQuery.data ?? []}
                            onChange={(_e, value) =>
                                    setFormValues((prev) => ({ ...prev, origin: `${value}` }))
                            }
                            renderInput={(params) => <TextField {...params} label="From" required />}
                        />
                        <Autocomplete
                            value={formValues.destination}
                            loading={citiesQuery.isLoading}
                            options={citiesQuery.data ?? []}
                            onChange={(_e, value) =>
                                setFormValues((prev) => ({ ...prev, destination: `${value}` }))
                            }
                            renderInput={(params) => <TextField {...params} label="To" required />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Date"
                                            value={formValues.date}
                                            disablePast
                                            onChange={(value: dayjs.Dayjs | null) =>
                                                setFormValues((prev) => ({ ...prev, date: value }))
                                            }
                                />
                        </LocalizationProvider>
                        <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'span 2', md: 'span 3' } }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Passenger count: 1
                            </Typography>
                            <Button type="submit" variant="contained">
                                Search
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {searchParams && (
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="time-filter-label">Time</InputLabel>
                                <Select
                                    labelId="time-filter-label"
                                    label="Time"
                                    value={timeFilter}
                                    onChange={handleTimeFilterChange}
                                    size="small"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="morning">Morning</MenuItem>
                                    <MenuItem value="afternoon">Afternoon</MenuItem>
                                    <MenuItem value="evening">Evening</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="price-filter-label">Price</InputLabel>
                                <Select
                                    labelId="price-filter-label"
                                    label="Price"
                                    value={priceFilter}
                                    onChange={handlePriceFilterChange}
                                    size="small"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="low">Low (&lt; $150)</MenuItem>
                                    <MenuItem value="medium">$150 – $249</MenuItem>
                                    <MenuItem value="high">High (≥ $250)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 180 }}>
                                <InputLabel id="airline-filter-label">Airline</InputLabel>
                                <Select
                                    labelId="airline-filter-label"
                                    label="Airline"
                                    value={airlineFilter}
                                    onChange={handleAirlineFilterChange}
                                    size="small"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {airlineOptions.map((airline) => (
                                        <MenuItem key={airline} value={airline}>
                                            {airline}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {flightsQuery.isLoading && <Typography>Loading flights…</Typography>}
                        {flightsQuery.isError && (
                            <Typography color="error">
                                Failed to load flights. Try again.
                            </Typography>
                        )}
                        {!flightsQuery.isLoading && flightsQuery.data && filteredFlights.length === 0 && (
                            <Typography>No flights match your filters.</Typography>
                        )}

                        {!flightsQuery.isLoading && filteredFlights.length > 0 && (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Airline</TableCell>
                                        <TableCell>Departure</TableCell>
                                        <TableCell>Arrival</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredFlights.map((flight) => (
                                        <TableRow key={flight.id} hover>
                                            <TableCell>{flight.airline}</TableCell>
                                            <TableCell>{flight.departureTime}</TableCell>
                                            <TableCell>{flight.arrivalTime}</TableCell>
                                            <TableCell>${flight.price}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleSelectFlight(flight)}
                                                >
                                                    Select
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}
