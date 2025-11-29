import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Box } from '@mui/material'

import Header from '@/components/Header'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <Box>
        <Header />
        <Outlet />
    </Box>
  ),
})
