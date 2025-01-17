import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useCurrentUser = () => {
    // const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);
    const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/current`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useCurrentUser;