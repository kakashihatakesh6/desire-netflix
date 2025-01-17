import useSWR from 'swr';
import fetcher from '@/lib/fetcher';


const useFavorites = () => {
    // const { data, error, isLoading, mutate } = useSWR('/api/favorites', fetcher, {
    const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/favorites`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading,
        mutate
    }

};

export default useFavorites;