import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header';
import GlobalContext from '../contexts/globalContext';
import { useContext } from 'react';
import Loader from '../components/Loader';

const DefaultLayout = () => {
    const { isLoading } = useContext(GlobalContext)
    return (
        <>
            <Header />
            <main className='container'>
                <Outlet />
            </main>
            {isLoading && <Loader />}
        </>
    );
};

export default DefaultLayout
