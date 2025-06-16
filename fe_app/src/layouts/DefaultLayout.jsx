import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalContext from '../contexts/globalContext'
import { useContext } from 'react'
import Loader from '../components/Loader'

const DefaultLayout = () => {
    const { isLoading } = useContext(GlobalContext)
    return (
        <div className="site-wrapper d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
            {isLoading && <Loader />}
        </div>
    )
}

export default DefaultLayout
