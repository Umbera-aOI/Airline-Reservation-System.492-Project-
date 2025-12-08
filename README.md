#### Running Code
Clone project, enter directory, and run `docker compose up`

#### Initial Setup
### Create Admin and Agents
Send POST call to server path (localhost:3001) `/auth/signup`
Data Payload:
```json
{
    "username": "agent",
    "password": "P@ssword1",
    "firstName": "Agent",
    "lastName": "Fink"
}
```
The first user created will have an admin role, all subsequent users will be agents
Admin is the only one who can create (and update/delete in the future) flights
The response if successful will look like
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInVzZXJuYW1lIjoiYWdlbnQyIiwiaWF0IjoxNzY1MTU5MDY5LCJleHAiOjE3NjUyMDIyNjl9.dEEq9VvvMvsl2gr1fAGwewFPRU1qboaOn3w-Rqj7A_A"
}
```
Copy this access token for creating flights
This token can also be retrieved by logging in via `/auth/login` using just username and password

### Create Flights
Send POST call to server path (localhost:3001) `/flights`
Data Payload:
```json
[
  {
    "origin": "Denver",
    "destination": "Atlanta",
    "date": "2025-12-15T08:25:00Z",
    "price": 21450,
    "flightCode": "FL450",
    "seatsAvailable": 14,
    "flightTime": 155
  },
  {
    "origin": "Denver",
    "destination": "Chicago",
    "date": "2025-11-03T13:40:00Z",
    "price": 18320,
    "flightCode": "FL451",
    "seatsAvailable": 6,
    "flightTime": 125
  },
  {
    "origin": "Denver",
    "destination": "Dallas",
    "date": "2025-10-21T17:05:00Z",
    "price": 16290,
    "flightCode": "FL452",
    "seatsAvailable": 22,
    "flightTime": 120
  }
]
```
You must attach an http header for authorization as the admin using the token received above. The Http Header looks like 
```
Authorization: Bearer <token>
```
