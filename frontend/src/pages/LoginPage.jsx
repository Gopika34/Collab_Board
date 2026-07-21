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
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <form onSubmit={handleLogin}
                className='bg-white p-8 rounded-lg shadow-md w-80 flex flex-col gap-4'
            >
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter valid email' className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter valid password' className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button type='submit' disabled={isLoading}
                    className="bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isLoading ? "Loading..." : "Login"}
                </button>
                <p className="text-sm text-gray-500 text-center">No account? create one <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
        </div>
    )
}

export default LoginPage
