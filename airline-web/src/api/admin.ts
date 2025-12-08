import {API_BASE_URL, headers} from './common'

type AgentStatistics = {
    id: number
    username: string
    firstName: string
    lastName: string
    reservationsCount: number
    reservationsProfit: number
}


export async function getAgentStatistics(jwtToken: string): Promise<AgentStatistics[]> {
    const request = new Request(`${API_BASE_URL}/users/agent-statistics`, {
        method: "GET",
        headers: {
            ...headers,
            Authorization: `Bearer ${jwtToken}`
        }
    });
    const response = await fetch(request);
    if (!response.ok) throw new Error(response.statusText);
    const statistics: AgentStatistics[] = await response.json();
    return statistics.map(stat => ({...stat, reservationsProfit: stat.reservationsProfit / 100.0}));
}
