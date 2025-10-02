import {FaGoogle} from "react-icons/fa"
import {useState} from 'react';
import apiClient  from '../api';
import {useAuth} from './AuthContext';

export default function LoginPop({open, onClose, onSuccess}) {
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err,setErr] = useState('')
    const [busy, setBusy] = useState(false);
    
    if (!open) return null;

    const submit = async () => {
        try {
            setBusy(true); 
            setErr('');
            const r = await apiClient.post(
                '/auth/login', 
                {email: email.trim().toLowerCase(), password},
                {withCredentials: true}
            );
            setUser(r.data.user);
            onSuccess?.();
            onClose?.();
        } catch (e) {
            setErr(e?.response?.data?.message || e.message || 'Login failed');
        } finally {setBusy(false); }
    };
    const handleGoogleLogin = () => {
        //open Google OAuth flow
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };
    
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
            <div className="bg-white rounded-2xl w-[360px] p-5">
                {/*email input*/}
                <h3 className="font-semibold text-lg rounded-lg px-3 py-2 mb-2">Sign in to continue</h3>
                <input className="w-full border rounded-lg px-3 py-2 mb-2"
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    autoFocus
                    disabled={busy}
                />
                {/*password input */}
                <input className="w-full border rounded-lg px-3 py-2 mb-3" type="password"
                    placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
                <div className="flex justify-end gap-2 mb-3">
                    <button onClick={onClose} disabled={busy}>Cancel</button>
                    <button className="bg-rose-500 text-white rounded-lg px-3 py-2 disabled:opacity-50"
                        onClick={submit} disabled={busy}>
                    {busy ? 'signing in...' : 'sign in'}
                    </button>
                </div>
                {/*divider*/}
                <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                {/*Google Login*/}
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full border rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                    <FaGoogle className="mr-2 text-red-500"/>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}