import {Outlet, createRootRouteWithContext, useRouter} from '@tanstack/react-router'
import {type QueryClient, useQueryClient} from '@tanstack/react-query'
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
