import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import type {Flight} from "@/api/flights.ts";
import {useState} from "react";
import {useAuth} from "@/api/auth.ts";
import DeleteFlightDialog from "@/components/DeleteFlightDialog.tsx";

export default ({
                    flightData,
                    handleSelectFlight,
                }: {
    flightData: Flight[],
    handleSelectFlight: (flight: Flight) => void,
}) => {
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');
    const [deleteFlightConfirmationId, setDeleteFlightConfirmationId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const userData = useAuth();

    const filteredFlights = flightData.filter((flight) => {
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

        return true;
    });

    const handleTimeFilterChange = (e: SelectChangeEvent) => {
        setTimeFilter(e.target.value as typeof timeFilter)
    }

    const handlePriceFilterChange = (e: SelectChangeEvent) => {
        setPriceFilter(e.target.value as typeof priceFilter)
    }

    const handleClickDeleteFlight = (id: number) => {
        setDeleteFlightConfirmationId(id);
    }

    const handleCloseDeleteFlightConfirmation = () => {
        setDeleteFlightConfirmationId(null);
    }
    const handleOpenSnackbar = () => {
        setSnackbarOpen(true);
    }
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
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
                    <FormControl sx={{minWidth: 150}}>
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

                    <FormControl sx={{minWidth: 150}}>
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
                </Box>
                {filteredFlights.length === 0 ?
                    (<Typography>No flights match your filters.</Typography>)
                    : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Flight Code</TableCell>
                                    <TableCell>Departure</TableCell>
                                    <TableCell>Arrival</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Seats Left</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFlights.map((flight) => (
                                    <TableRow key={flight.id} hover>
                                        <TableCell>{flight.flightCode}</TableCell>
                                        <TableCell>{flight.departureTime}</TableCell>
                                        <TableCell>{flight.arrivalTime}</TableCell>
                                        <TableCell>${flight.price.toFixed(2)}</TableCell>
                                        <TableCell>{flight.seatsAvailable - (flight.seatsReserved ?? 0)}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleSelectFlight(flight)}
                                            >
                                                Select
                                            </Button>
                                            {userData?.role == 'admin' &&
                                                <IconButton color="error"
                                                            onClick={() => handleClickDeleteFlight(flight.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
            </CardContent>
            <DeleteFlightDialog onClose={handleCloseDeleteFlightConfirmation} openSnackbar={handleOpenSnackbar}
                                flightId={deleteFlightConfirmationId}/>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity='success'
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    Delete Flight Successful
                </Alert>
            </Snackbar>
        </Card>
    );
}