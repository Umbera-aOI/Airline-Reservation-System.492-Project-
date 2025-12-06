import {API_BASE_URL, headers} from './common'

export type PaymentPayload = {
    cardNumber: string
    nameOnCard: string
    expiry: string // "MM/YY"
    cvv: string
}

export type Reservation = {
    confirmationCode: string
    firstName: string
    lastName: string
    flightId: number
}

export async function payForFlight(input: {
    flightId: string,
    firstName: string,
    lastName: string,
}): Promise<Reservation> {
    const request = new Request(`${API_BASE_URL}/reservations`, {
        method: "POST",
        body: JSON.stringify(input),
        headers
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
