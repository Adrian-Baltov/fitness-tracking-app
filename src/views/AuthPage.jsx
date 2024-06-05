import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex w-full justify-center items-center">
            <div className=" p-6 bg-white justify-center rounded-md">
            {isLogin ? (
                <>
                    <Login />
                    <p>Do not have an account? <a href="#" onClick={() => setIsLogin(false)} className="font-semibold mt-3">Sign Up</a></p>
                </>
            ) : (
                <>
                    <Register />
                    <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)} className="font-semibold mt-3">Login</a></p>
                </>
            )}
            </div>
        </div>
    );
}
