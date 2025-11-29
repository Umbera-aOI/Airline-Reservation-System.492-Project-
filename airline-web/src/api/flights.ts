import * as dayjs from 'dayjs'

// src/api/flights.ts
export type FlightSearchParams = {
    origin: string
    destination: string
    date: dayjs.Dayjs | null
}

export type Flight = {
    id: string
    airline: string
    departureTime: string // "HH:mm"
    arrivalTime: string // "HH:mm"
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
    confirmationId: string
}

export async function searchFlights(
    params: FlightSearchParams,
): Promise<Flight[]> {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 400))

    // Mock data using the search params
    return [
        {
            id: 'F001',
            airline: 'SkyJet',
            departureTime: '08:15',
            arrivalTime: '10:05',
            price: 149,
            origin: params.origin,
            destination: params.destination,
        },
        {
            id: 'F002',
            airline: 'Aurora Air',
            departureTime: '13:40',
            arrivalTime: '15:30',
            price: 189,
            origin: params.origin,
            destination: params.destination,
        },
        {
            id: 'F003',
            airline: 'SkyJet',
            departureTime: '18:10',
            arrivalTime: '20:00',
            price: 220,
            origin: params.origin,
            destination: params.destination,
        },
        {
            id: 'F004',
            airline: 'CloudNine',
            departureTime: '21:10',
            arrivalTime: '23:00',
            price: 120,
            origin: params.origin,
            destination: params.destination,
        },
    ]
}

export async function getFlightById(id: string): Promise<Flight> {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 200))
    return {
        id,
        airline: 'SkyJet',
        departureTime: '08:15',
        arrivalTime: '10:05',
        price: 149,
        origin: 'DEN',
        destination: 'LAX',
    }
}


export async function getCities(): Promise<String[]> {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 400))

    return ['Denver', 'Los Angeles', 'Chicago', 'New York', 'Seattle', 'Atlanta', 'Miami']
}

export async function payForFlight(input: {
    flightId: string
    payload: PaymentPayload
}): Promise<PaymentResult> {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 600))
    return {
        confirmationId: 'CNF-' + input.flightId + '-12345',
    }
}
