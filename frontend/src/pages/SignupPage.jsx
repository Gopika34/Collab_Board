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
        <div className='min-h-screen flex justify-center items-center bg-background'>
            <form onSubmit={handleSignup}
                className='bg-surface border border-border p-8 rounded-xl shadow-lg hover:shadow-xl transition-all w-full max-w-md flex flex-col gap-4'
            >
                <h3 className='text-3xl font-bold text-center text-text-primary mb-2'>Create Account</h3>
                <p className='text-lg font-medium text-center text-text-secondary mb-2'>Manage boards, tasks and projects in one place.</p>
                <label htmlFor="userName" className='text-sm font-medium text-text-secondary'>Username</label>
                <input className={inputStyle} id='userName' type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Enter username'/>
                <label htmlFor="email" className='text-sm font-medium text-text-secondary'>Email</label>
                <input className={inputStyle} id='email' type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email'/>
                <label htmlFor="password" className='text-sm font-medium text-text-secondary'>Password</label>
                <input className={inputStyle} id='password' type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password'/>
                <button className='bg-accent text-text-primary font-medium py-3 rounded-xl hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Create Account"}</button>
                <p className='text-sm text-text-secondary text-center'>Already have an account? <Link to='/login' className='text-accent text-sm hover:text-accent-hover hover:underline'>Login</Link></p>
                {error && 
                <div className='bg-danger/10 border border-danger/30 rounded-xl p-3 flex justify-center items-center'>
                    <p className='text-danger text-sm text-center'>{error}</p>
                </div>
                }
            </form>
        </div>
    )
}

export default SignupPage
