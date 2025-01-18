import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

const useBillboard = () => {
    // const { data, error, isLoading } = useSWR('/api/random', fetcher, {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/random`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading
    }
} 

export default useBillboard;