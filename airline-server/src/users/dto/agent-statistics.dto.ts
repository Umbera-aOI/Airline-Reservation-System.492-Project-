import {Reservation} from "../../reservations/reservation.entity";

export class AgentStatisticsDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    reservationsCount: number;
    reservationsProfit: number;
}
