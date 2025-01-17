import useSWR from "swr";
import fetcher from '@/lib/fetcher';

const useMovieList = () => {
    // const { data, error, isLoading } = useSWR('/api/movies', fetcher, {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/movies`, fetcher, {
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

export default useMovieList;