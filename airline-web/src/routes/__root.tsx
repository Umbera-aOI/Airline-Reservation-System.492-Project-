import {useState} from "react";
import {Outlet, createRootRouteWithContext, useRouter} from '@tanstack/react-router'
import {type QueryClient, type UseMutationResult} from '@tanstack/react-query'
import {Box} from '@mui/material'

import Header from '@/components/Header'


interface MyRouterContext {
    queryClient: QueryClient,
    userMutation: UseMutationResult<string, unknown, { jwtToken: string }>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => {
        const userMutation = Route.useLoaderData()
        const router = useRouter()
        const [jwtToken, setJwtToken] = useState<string | undefined>()

        const handleLogin = async (jwtToken: string) => {
            await userMutation.mutateAsync({jwtToken})
            setJwtToken(jwtToken);
            router.invalidate();
        }
        return (
            <Box>
                <Header onLogin={handleLogin} jwtToken={jwtToken}/>
                <Outlet/>
            </Box>
        );
    },
    loader: ({context}) => context.userMutation,
})
