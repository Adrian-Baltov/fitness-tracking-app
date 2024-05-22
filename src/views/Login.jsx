import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();
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
                <div className="login-label">Sign in your account</div>
                <div className="login-border"></div>
                <div className="login-input-container">
                    <div className="login-inputs">
                        <label htmlFor="email">Email </label>
                        <input className="login-input" value={form.email} placeholder="Email" onChange={updateForm('email')} type="text" name="email" id="email" />
                    </div>
                    <div className="login-inputs">
                        <label htmlFor="password">Password </label>
                        <input className="login-input" value={form.password} placeholder="Password" onChange={updateForm('password')} type="password" name="password" id="password"/>
                    </div>

                    <p onClick={loginUser}>
                        Sign in
                    </p>
                </div>

                {error && <p className="error">{error}</p>}
            </div>
        </>

    )
}
