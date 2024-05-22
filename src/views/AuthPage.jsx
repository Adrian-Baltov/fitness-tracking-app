import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="form">
            {isLogin ? (
                <>
                    <Login />
                    <p>Do not have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign Up</a></p>
                </>
            ) : (
                <>
                    <Register />
                    <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a></p>
                </>
            )}
        </div>
    );
}
