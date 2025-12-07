import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {type QueryClient} from '@tanstack/react-query'
import {Box} from '@mui/material'

import Header from '@/components/Header'


interface MyRouterContext {
    queryClient: QueryClient,
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => {
        return (
            <Box>
                <Header/>
                <Outlet/>
            </Box>
        );
    },
})
