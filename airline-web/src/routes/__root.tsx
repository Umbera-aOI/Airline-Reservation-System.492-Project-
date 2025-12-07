import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {Box} from '@mui/material'

import Header from '@/components/Header'

import {type QueryClient, useMutation} from '@tanstack/react-query'

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => {
        const userMutation = useMutation({
            mutationFn: ({jwtToken}: { jwtToken: string }) => {
                return Promise.resolve(jwtToken);
            },
        })

        const handleLogin = (jwtToken: string) => {
            userMutation.mutate({jwtToken})
        }

        return (
            <Box>
                <Header onLogin={handleLogin} jwtToken={userMutation.data}/>
                <Outlet/>
            </Box>
        );
    },
})
