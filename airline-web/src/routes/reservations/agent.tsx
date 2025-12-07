import {createFileRoute} from '@tanstack/react-router'
import {useIsRestoring, useQuery} from '@tanstack/react-query'
import {
    Box,
    CircularProgress,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Typography,
} from '@mui/material'
import {getAgentReservations} from '@/api/reservations.ts'

export const Route = createFileRoute(
    '/reservations/agent'
)({
    component: AgentReservations,
    loader: ({context}) => context.queryClient.getQueryData(['jwtToken']),
})

function AgentReservations() {
    const jwtToken = Route.useLoaderData();
    const {data: reservations, isError, isLoading} = useQuery({
        queryKey: ['agent-reservations', jwtToken],
        queryFn: () => getAgentReservations(jwtToken!),
        enabled: !!jwtToken
    })
    const isRestoring = useIsRestoring();
    console.log(isRestoring);
    console.log(jwtToken);

    return !!jwtToken ? (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            {
                isLoading && <Typography variant="h4">Loading... <CircularProgress/></Typography>
            }
            {
                !isLoading && isError && <Typography variant="h4">Error Loading Reservations</Typography>
            }
            {
                !isLoading && !isError && reservations &&
                <Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Reservation ID</TableCell>
                                <TableCell>Flight ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Confirmation Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((reservation) => (
                                <TableRow key={reservation.id} hover>
                                    <TableCell>{reservation.id}</TableCell>
                                    <TableCell>{reservation.flightId}</TableCell>
                                    <TableCell>{reservation.firstName}</TableCell>
                                    <TableCell>{reservation.lastName}</TableCell>
                                    <TableCell>{reservation.confirmationCode}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            }
        </Box>
    ) : (
        <Typography variant='h4'>Please login to view your reservations</Typography>
    );
}
