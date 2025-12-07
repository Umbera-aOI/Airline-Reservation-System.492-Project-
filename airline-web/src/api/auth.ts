import {API_BASE_URL, headers} from './common'

export async function login(
    username: string,
    password: string
): Promise<string> {
    const request = new Request(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({username, password}),
        headers
    });
    const response = await fetch(request);
    if (!response.ok) throw new Error(response.statusText);
    return response.json().then(json => json.access_token);
}

export async function signup(
    username: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<string> {
    const request = new Request(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({username, password, firstName, lastName}),
        headers
    });
    const response = await fetch(request);
    return response.text();
}
