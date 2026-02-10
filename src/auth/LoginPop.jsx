import {FaGoogle} from "react-icons/fa"
import {useState} from 'react';
import apiClient  from '../api';
import {useAuth} from './AuthContext';

export default function LoginPop({open, onClose, onSuccess}) {
    const { setUser } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [firstName, setFirstName]  = useState('');
    const [lastName, setLastName]  = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err,setErr] = useState('')
    const [busy, setBusy] = useState(false);
    
    if (!open) return null;

    const submit = async () => {
        try {
            setBusy(true); 
            setErr('');

            //Validation guard
            if (isRegister && (!firstName.trim() || !lastName.trim())) {
                setErr("Please enter both first and last names.");
                setBusy(false);
                return;
            }

    
            if (!email.trim() || !password) {
                setErr("Email and password are required.");
                setBusy(false);
                return;
            }
            //Choosing endpoint based on mode
            const route = isRegister ? '/auth/register' : '/auth/login' ;

            const payload = isRegister 
                ? {
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    email: email.trim().toLowerCase(), 
                    password
                }
                : {email: email.trim().toLowerCase(), password};

            const r = await apiClient.post(route, payload, {withCredentials: true}
            );
            setUser(r.data.user);
            onSuccess?.();
            onClose?.();
        } catch (e) {
            const data = e?.response?.data;
            const msg = data?.message || (data?.errors ? data.errors.map(x => x.msg).join(", ") : null) || e.message || "Login failed";
        setErr(msg);

        } finally {setBusy(false); }
    };
    const handleGoogleLogin = () => {
        //open Google OAuth flow
        const targetUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
        console.log("Attemmpting redicrect to:", targetUrl);
        window.location.href = targetUrl
       };
    
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
            <div className="bg-white rounded-2xl w-[360px] p-5">            {/*Dynamic Title*/}
                <h3 className="font-semibold text-lg mb-2">
                    {isRegister ? 'Create an Account' : 'Sign in to continue'}
                </h3>

                {/*Show Name input only if registering*/}
                {isRegister && (
                    <div className="flex gap-2 mb-2">
                        <input
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={busy}
                        />
                        <input
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={busy}
                        />
                    </div>
                )}
            
                <input
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus={!isRegister}
                    disabled={busy}
                />
                <input 
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                />

                {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

                <div className="flex justify-end gap-2 mb-3">
                    <button onClick={onClose} 
                    disabled={busy}
                    className="cursor-pointer hover:underline"
                    >Cancel</button>
                    <button
                        className="bg-rose-500 text-white rounded-lg px-3 py-2 disabled:opacity-50 cursor-pointer"
                        onClick={submit}
                        disabled={busy}
                    >
                        {busy ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
                    </button>
                </div>
                {/*Toggle link*/}
                <div className="text-center text-sm mb-3">
                    <span className="text-gray-500">
                        {isRegister ? "Already have an account? "  : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => {
                        setIsRegister(!isRegister);
                        setErr('');
                        setFirstName('');
                        setLastName('');
                    }}
                    className="text-rose-500 font-medium hover:underline cursor-pointer">
                        {isRegister ? "Sign In" : "Register"}
                    </button>
                </div>

                <div className="flex items-center my-3">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full border rounded-lg px-3 py-3 hover:bg-gray-50 cursor-pointer"
            >
                <FaGoogle className="mr-2 text-red-500" />
                {isRegister? "Sign up with Google" : "Continue with Google"}
            </button>
        </div>
    </div>

    );
}