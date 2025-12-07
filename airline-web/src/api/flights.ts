import dayjs from 'dayjs'

export type FlightSearchParams = {
    origin: string
    destination: string
    date: dayjs.Dayjs | null
}

export type Flight = {
    id: number
    flightCode: string
    departureTime: string
    arrivalTime: string
    price: number
    origin: string
    destination: string
}
import {API_BASE_URL} from './common'

function mapFlight(flight: any) {
    return {
        id: flight.id,
        origin: flight.origin,
        destination: flight.destination,
        flightCode: flight.flightCode,
        price: flight.price / 100.0,
        departureTime: dayjs(flight.date).format('HH:mm'),
        arrivalTime: dayjs(flight.date).add(4, 'hours').format('HH:mm'),
    };
}


export async function searchFlights(
    params: FlightSearchParams,
): Promise<Flight[]> {
    const urlParams = new URLSearchParams();
    urlParams.append('origin', params.origin);
    urlParams.append('destination', params.destination);
    urlParams.append('date', params.date!.toISOString());
    const request = new Request(`${API_BASE_URL}/flights/search?${urlParams}`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json().then((flights) => flights.map(mapFlight));
}

export async function getFlightById(id: number): Promise<Flight> {
    const request = new Request(`${API_BASE_URL}/flights/by-id/${id}`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json().then(mapFlight);
}

export async function getOrigins(): Promise<String[]> {
    const request = new Request(`${API_BASE_URL}/flights/origins`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json();
}

export async function getDestinations(origin: string): Promise<String[]> {
    const request = new Request(`${API_BASE_URL}/flights/destinations?origin=${origin}`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json();
}