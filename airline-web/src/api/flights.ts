import dayjs from 'dayjs'

// src/api/flights.ts
export type FlightSearchParams = {
    origin: string
    destination: string
    date: dayjs.Dayjs | null
}

export type Flight = {
    id: number
    airline: string
    departureTime: string
    arrivalTime: string
    price: number
    origin: string
    destination: string
}

export type PaymentPayload = {
    cardNumber: string
    nameOnCard: string
    expiry: string // "MM/YY"
    cvv: string
}

export type PaymentResult = {
    confirmationCode: string
}

const API_BASE_URL = 'http://localhost:3001';

export async function searchFlights(
    params: FlightSearchParams,
): Promise<Flight[]> {
    const urlParams = new URLSearchParams();
    urlParams.append('origin', params.origin);
    urlParams.append('destination', params.destination);
    urlParams.append('date', params.date!.toISOString());
    const request = new Request(`${API_BASE_URL}/flights?${urlParams}`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json().then((flights) => flights.map((flight: any) =>
        ({
            id: flight.id,
            origin: flight.origin,
            destination: flight.destination,
            airline: 'ABC',
            price: Math.floor(Math.random() * 400) + 200,
            departureTime: dayjs(flight.date).format('HH:mm'),
            arrivalTime: dayjs(flight.date).add(4, 'hours').format('HH:mm'),
        }
    )));
}

export async function getFlightById(id: string): Promise<Flight> {
    const request = new Request(`${API_BASE_URL}/flights/${id}`, {
        method: "GET"
    });
    const response = await fetch(request);
    return response.json().then((flight) =>
        ({
                id: flight.id,
                origin: flight.origin,
                destination: flight.destination,
                airline: 'ABC',
                price: Math.floor(Math.random() * 400) + 200,
                departureTime: dayjs(flight.date).format('HH:mm'),
                arrivalTime: dayjs(flight.date).add(4, 'hours').format('HH:mm'),
            }
        ));
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

export async function payForFlight(input: {
    flightId: string,
    firstName: string,
    lastName: string,
}): Promise<PaymentResult> {
    const request = new Request(`${API_BASE_URL}/reservations`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' }
    });
    const response = await fetch(request);
    return response.json().then((result) => ({
        confirmationCode: result.confirmationCode
    }));
}
