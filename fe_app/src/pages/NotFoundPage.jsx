import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div className="text-center my-5 p-5 shadow">
            <h1 className="fw-semibold">404</h1>
            <h3 >Page not Found</h3>
            <p className="mt-3 text-secondary fw-light">The page you requested does not exist</p>
            <Link to="/" className="btn btn-success mt-5">Return to homepage</Link>
        </div>
    )
}

export default NotFoundPage
