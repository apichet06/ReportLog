import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    UserId: string;
    exp: number;
    [key: string]: unknown;
}

export function getUserIdFromCookie(): string | null {
    const token = Cookies.get('authToken'); // <-- ดึง token จาก cookie

    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.UserId;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
