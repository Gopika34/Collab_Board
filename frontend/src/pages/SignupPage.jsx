import {useState} from 'react'
import { signup } from '../api/auth';
import {useNavigate, Link} from "react-router-dom";

const SignupPage = () => {
    const[userName,setUserName]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate=useNavigate();

    const handleSignup=async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if(!email.trim()|| !password || !userName.trim()){
            setError('All fields are required!');
            setIsLoading(false);
            return;
        }

        try{
            await signup({
                userName: userName.trim(),
                email: email.trim(),
                password
            });
            navigate('/login');
        }
        catch(err){
            setPassword('');
            setError(err.response?.data?.message || "Signup failed");
        }
        finally{
            setIsLoading(false);
        }
    }
    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100'>
            <form onSubmit={handleSignup}
                className='bg-white p-5 rounded-lg shadow-md w-96 flex flex-col gap-4'
            >
                <h3 className='text-3xl font-bold text-center text-blue-400 mt-3'>Create Account</h3>
                <input className='w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-200' type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter username'/>
                <input className='w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-200' type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email'/>
                <input className='w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-200' type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password'/>
                <button className='bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Signup"}</button>
                <p className='text-sm text-gray-500 text-center'>Already have an account? <Link to='/login' className='text-blue-600 text-sm hover:underline'>Login</Link></p>
                {error && <p className='text-red-600 text-sm text-center mt-2'>{error}</p>}
            </form>
        </div>
    )
}

export default SignupPage
