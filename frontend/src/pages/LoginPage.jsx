import { useState } from 'react'
import { login as LoginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const res = await LoginApi({ 
                email: email.trim(), 
                password
            });
            login(res.data.token);
            navigate('/dashboard');
        }
        catch (err) {
            setPassword('');
            setError(err.response?.data?.message || "Login failed");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <form onSubmit={handleLogin}
                className='bg-surface border border-border p-8 rounded-lg shadow-md w-80 flex flex-col gap-4'
            >
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter valid email' className="border border-border bg-surface-elevated text-text-primary placeholder-text-muted rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter valid password' className="border border-border bg-surface-elevated text-text-primary placeholder-text-muted rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <button type='submit' disabled={isLoading}
                    className="bg-accent text-text-primary font-medium py-2 rounded hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? "Loading..." : "Login"}
                </button>
                <p className="text-sm text-text-secondary text-center">No account? create one <Link to="/signup" className="text-accent hover:text-accent-hover hover:underline">Sign Up</Link></p>
                {error && <p className="text-danger text-sm mt-2 text-center">{error}</p>}
            </form>
        </div>
    )
}

export default LoginPage
