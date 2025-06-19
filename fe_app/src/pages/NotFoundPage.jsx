import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {

    const navigate = useNavigate();

    return (
        <div className="text-center my-5 p-5 shadow">
            <h1 className="fw-semibold">404</h1>
            <h3 >Page not Found</h3>
            <p className="mt-3 text-secondary fw-light">The page you requested does not exist</p>
            <button
                className="btn btn-outline-light mt-5"
                onClick={() => { navigate("/") }}
            >Return to homepage</button>
        </div>
    )
}

export default NotFoundPage
