import {API_BASE_URL, headers} from './common'

export type PaymentPayload = {
    cardNumber: string
    nameOnCard: string
    expiry: string // "MM/YY"
    cvv: string
}

export type Reservation = {
    id: number
    confirmationCode: string
    firstName: string
    lastName: string
    flightId: number
}

export async function payForFlight(input: {
    flightId: string,
    firstName: string,
    lastName: string,
}, jwtToken?: string): Promise<Reservation> {
    let requestHeaders = new Headers(headers);
    if (jwtToken) {
        requestHeaders.set('Authorization', 'Bearer ' + jwtToken);
    }
    const request = new Request(`${API_BASE_URL}/reservations`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: requestHeaders
    });
    const response = await fetch(request);
    return response.json();
}


export async function getReservation(
    confirmationCode: string, lastName: string
): Promise<Reservation> {
    const urlParams = new URLSearchParams();
    urlParams.append('confirmationCode', confirmationCode);
    urlParams.append('lastName', lastName);
    const request = new Request(`${API_BASE_URL}/reservations?${urlParams}`);
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}

export async function getAgentReservations(jwtToken: string): Promise<Reservation[]> {
    const request = new Request(`${API_BASE_URL}/reservations/by-agent`, {
        method: "GET",
        headers: {
            ...headers,
            Authorization: `Bearer ${jwtToken}`
        }
    });
    const response = await fetch(request);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
}
