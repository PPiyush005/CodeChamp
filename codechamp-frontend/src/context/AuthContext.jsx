import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    if (token && name && email) {
        // Verify token is not expired
        try {
            const payload = JSON.parse(
                atob(token.split('.')[1])
            );
            const isExpired =
                payload.exp * 1000 < Date.now();

            if (isExpired) {
                localStorage.clear();
                setUser(null);
            } else {
                setUser({ token, name, email });
            }
        } catch (err) {
            localStorage.clear();
            setUser(null);
        }
    }
    setLoading(false);
}, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);