import {createFileRoute} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
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
import {getAgentStatistics} from '@/api/admin.ts'
import {useAuth} from "@/api/auth.ts";

export const Route = createFileRoute(
    '/admin/agent-statistics'
)({
    component: AgentStatistics,
})

function AgentStatistics() {
    const userData = useAuth();
    const jwtToken = userData?.jwtToken;
    const {data: statistics, isError, isLoading} = useQuery({
        queryKey: ['agent-statistics', jwtToken],
        queryFn: () => getAgentStatistics(jwtToken!),
        enabled: !!jwtToken
    })

    return userData?.role == 'admin' ? (
        <Box sx={{maxWidth: 600, mx: 'auto', mt: 4}}>
            {
                isLoading && <Typography variant="h4">Loading... <CircularProgress/></Typography>
            }
            {
                !isLoading && isError && <Typography variant="h4">Error Loading Agent Information</Typography>
            }
            {
                !isLoading && !isError && statistics &&
                <Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Agent Name</TableCell>
                                <TableCell>Total Reservations Booked</TableCell>
                                <TableCell>Total Profit from Reservations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {statistics.map((agentStatistic) => (
                                <TableRow key={agentStatistic.id} hover>
                                    <TableCell>{`${agentStatistic.firstName} ${agentStatistic.lastName}`}</TableCell>
                                    <TableCell>{agentStatistic.reservationsCount}</TableCell>
                                    <TableCell>{agentStatistic.reservationsProfit.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            }
        </Box>
    ) : (
        <Typography variant='h4'>Please login to view agent statistics</Typography>
    );
}
