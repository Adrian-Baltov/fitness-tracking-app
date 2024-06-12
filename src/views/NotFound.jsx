import { useNavigate } from "react-router-dom"

/* eslint-disable react/no-unescaped-entities */
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="p-6 glass justify-center items-center w-1/3 rounded-md">
            <h2>404 - Page not found!</h2> <br />
            <p>The page you are looking for might be removed, had it's name changed or is temporarily unavailable</p> <br />
            <button className="btn" onClick={() => navigate('/')}>Go to Home</button>
            </div>
        </div>
    )
}

export default NotFound