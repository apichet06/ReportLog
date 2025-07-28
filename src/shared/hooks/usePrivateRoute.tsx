import { useAuthContext } from '../context/AuthContext';

export default function usePrivateRoute() {
    const { token } = useAuthContext();
    return !!token;
}
