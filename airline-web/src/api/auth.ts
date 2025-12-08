import {useEffect, useState} from "react";
import {useRouter} from "@tanstack/react-router";
import {API_BASE_URL, headers} from './common';

export type User = {
    jwtToken: string
    username: string
    role: string
}

let user: User | null = null;
retrieveLocalStorage();
let callbackIndex = 0;
let callbacksToCall: {
    [index: number]: (user: User | null) => void;
} = {};


function retrieveLocalStorage() {
    let jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        user = {
            jwtToken,
            username: localStorage.getItem('username')!,
            role: localStorage.getItem('role')!
        }
    }
}

function onLogin(callback: (user: User | null) => void) {
    let index = callbackIndex++;
    callbacksToCall[index] = callback;
    return () => {
        delete callbacksToCall[index];
    }
}

function setUserOnCallbacks(user: User | null) {
    Object.values(callbacksToCall).forEach(callback => callback(user));
}

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
    let asJson = await response.json();
    let {access_token: jwtToken, role} = asJson;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    setUserOnCallbacks({jwtToken, username, role});
    return jwtToken!;
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

export function logout() {
    user = null;
    localStorage.removeItem('jwtToken');
    setUserOnCallbacks(null);
}

export function useAuth() {
    const router = useRouter()
    const [hookUser, setHookUser] = useState<User | null>(user)

    useEffect(() =>
        onLogin((user) => {
            setHookUser(user);
            router.invalidate();
        }), [])

    return hookUser;
}