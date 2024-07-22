import { jwtDecode } from 'jwt-decode';
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';
import he from 'he';

export const AuthContext = createContext();

async function getDecodedToken(token) {
    try {
        return await jwtDecode(token);
    } catch (e) {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [encodedToken, setEncodedToken] = useState(null);
    const [loading, setLoading] = useState(true);

    async function updateToken(newToken) {
        localStorage.setItem('jwt', newToken);
        const decodedToken = await getDecodedToken(newToken);
        if (decodedToken) {
            decodedToken.name = he.unescape(decodedToken.name);
            decodedToken.email = he.unescape(decodedToken.email);
            setEncodedToken(newToken);
        }
        setToken(decodedToken);
    }

    function removeToken() {
        localStorage.removeItem('jwt');
        setToken(null);
        setEncodedToken(null);
    }

    const refresh = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('something went wrong while refreshing token');
            }
            const jsonResponse = await response.json();
            const newToken = jsonResponse.accessToken;
            console.log('refreshing!');
            updateToken(newToken);
        } catch (e) {
            removeToken();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        async function handleTokenChange() {
            const initialToken = localStorage.getItem('jwt');
            const decodedToken = await getDecodedToken(initialToken);
            if (decodedToken) {
                decodedToken.name = he.unescape(decodedToken.name);
                decodedToken.email = he.unescape(decodedToken.email);
            }
            setToken(decodedToken);
            if (decodedToken) {
                setEncodedToken(initialToken);
                if (decodedToken.exp * 1000 - Date.now() > 0) {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        handleTokenChange();
    }, []);

    const handleRefresh = useCallback(async () => {
        if (token) {
            await refresh();
        }
    }, [token, refresh]);
    const handleSetTimer = useCallback(() => {
        if (!token) return;
        const expirationTime = token.exp * 1000 - Date.now();
        const expirationTimer = setTimeout(async () => {
            handleRefresh();
        }, expirationTime - 60000); // one minute before it expires
        return expirationTimer;
    }, [token, handleRefresh]);
    useEffect(() => {
        const timer = handleSetTimer();
        return () => clearTimeout(timer);
    }, [token, handleSetTimer]);

    const contextValue = useMemo(
        () => ({
            token,
            encodedToken,
            loading,
            updateToken,
            removeToken
        }),
        [token, encodedToken, loading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
