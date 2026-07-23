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
            setError(err.response?.data?.message || "⚠ Signup Failed");
        }
        finally{
            setIsLoading(false);
        }
    }

    const inputStyle ="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300";
    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100'>
            <form onSubmit={handleSignup}
                className='bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all w-full max-w-md flex flex-col gap-4'
            >
                <h3 className='text-3xl font-bold text-center text-slate-900 mb-2'>Create Account</h3>
                <p className='text-lg font-medium text-center text-slate-700 mb-2'>Manage boards, tasks and projects in one place.</p>
                <label htmlFor="userName" className='text-sm font-medium'>Username</label>
                <input className={inputStyle} id='userName' type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter username'/>
                <label htmlFor="email" className='text-sm font-medium'>Email</label>
                <input className={inputStyle} id='email' type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email'/>
                <label htmlFor="password" className='text-sm font-medium'>Password</label>
                <input className={inputStyle} id='password' type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password'/>
                <button className='bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Create Account"}</button>
                <p className='text-sm text-gray-500 text-center'>Already have an account? <Link to='/login' className='text-blue-600 text-sm hover:underline'>Login</Link></p>
                {error && 
                <div className='bg-red-50 border border-red-200 rounded-xl p-3 flex justify-center items-center'>
                    <p className='text-red-600 text-sm text-center'>{error}</p>
                </div>
                }
            </form>
        </div>
    )
}

export default SignupPage
