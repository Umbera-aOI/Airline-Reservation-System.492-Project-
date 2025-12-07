import {QueryClient} from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister'

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
})

export function getContext() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        }
    })
    queryClient.setMutationDefaults(['jwtToken'], {
        mutationFn: async ({jwtToken}: { jwtToken: string }) => jwtToken
    });

    return {
        queryClient,
    }
}

export function Provider({
                             children,
                             queryClient,
                         }: {
    children: React.ReactNode
    queryClient: QueryClient
}) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: asyncStoragePersister,
            }}
            onSuccess={() => queryClient.refetchQueries()}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
