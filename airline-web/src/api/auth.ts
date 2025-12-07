import {useEffect, useState} from "react";
import {useRouter} from "@tanstack/react-router";
import {API_BASE_URL, headers} from './common'

let jwtToken = localStorage.getItem('jwtToken');
let callbackIndex = 0;
let callbacksToCall: {
    [index: number]: (jwtToken: string) => void;
} = {};

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
    return response.json().then(json => {
        jwtToken = json.access_token;
        localStorage.setItem('jwtToken', jwtToken!);
        Object.values(callbacksToCall).forEach(callback => callback(jwtToken!));
        return jwtToken!;
    });
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

export function onLogin(callback: (jwtToken: string) => void) {
    let index = callbackIndex++;
    callbacksToCall[index] = callback;
    return () => {
        delete callbacksToCall[index];
    }
}

export function useAuth() {
    const router = useRouter()
    const [hookJwtToken, setHookJwtToken] = useState<string | null>(jwtToken)

    useEffect(() =>
        onLogin((token) => {
            setHookJwtToken(token);
            router.invalidate();
        }), [])

    return hookJwtToken;
}