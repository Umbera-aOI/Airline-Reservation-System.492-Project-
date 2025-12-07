import {Outlet, createRootRouteWithContext, useRouter} from '@tanstack/react-router'
import {type QueryClient, useQueryClient} from '@tanstack/react-query'
import {Box} from '@mui/material'

import Header from '@/components/Header'


interface MyRouterContext {
    queryClient: QueryClient,
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => {
        const queryClient = useQueryClient();
        const router = useRouter();

        const handleLogin = async (jwtToken: string) => {
            queryClient.setQueryData(['jwtToken'], jwtToken);
            router.invalidate();
        }
        return (
            <Box>
                <Header onLogin={handleLogin} jwtToken={queryClient.getQueryData(['jwtToken'])}/>
                <Outlet/>
            </Box>
        );
    },
})
