import { useQuery } from "@tanstack/react-query"
import instance from "../request";

const useAuth = () =>{
    return useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            const response = await instance.get("auth/me");
            return response.data;
        },
        retry: false,
    });
}

export default useAuth;