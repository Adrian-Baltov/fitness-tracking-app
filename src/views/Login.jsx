import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AUTH_INPUT, AUTH_LABEL } from "../constants/constants";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();
        const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/');
        }
    }, [user]);

    const loginUser = async () => {
        try {
            await login(form.email, form.password);
            navigate(location.state?.from.pathname || '/');
        } catch (error) {
            setError("Invalid email or password. Please try again.");
        }
    };

    const updateForm = prop => e => {
        setForm({
            ...form,
            [prop]: e.target.value,
        });
    };

    return (
        <>
            <style>color: black</style>
            <div className="login-container">
                <div className="login-label text-3x1 block text-center font-semibold">Sign in your account</div>
                <div className="login-border"></div>
                <div className="login-input-container">
                    <div className={AUTH_INPUT}>
                        <label className={AUTH_LABEL}>Email
                            <input className="login-input" value={form.email} placeholder="Email" onChange={updateForm('email')} type="text" name="email" id="email" />
                        </label>
                    </div>
                    <div className={AUTH_INPUT}>
                        <label className={AUTH_LABEL}>Password
                            <input className="login-input" value={form.password} placeholder="Password" onChange={updateForm('password')} type="password" name="password" id="password" />
                        </label>
                    </div>

                    <button className="inline-block mt-3 mb-3 cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900" onClick={loginUser}>
                        Sign in
                    </button>
                </div>

                {error && <div role="alert" className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{error}</span>
                </div>}
            </div>
        </>

    )
}