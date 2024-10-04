import { themeChange } from 'theme-change'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import { Link } from 'react-router-dom'


function Header() {

    const { pageTitle } = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    useEffect(() => {
        themeChange(false)
        if (currentTheme === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setCurrentTheme("dark")
            } else {
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
    }, [])




    function logoutUser() {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <>
            <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">


                {/* Menu toogle for mobile view or small screen */}
                <div className="">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                        <Bars3Icon className="h-5 inline-block w-5" /></label>
                    <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
                </div>



                <div className="order-last">


                    {/* Light and dark theme selection toogle **/}
                    {/* <label className="swap ">
                <input type="checkbox"/>
                <SunIcon data-set-theme="light" data-act-className="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                <MoonIcon data-set-theme="dark" data-act-className="ACTIVECLASS" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
            </label> */}



                    {/* Profile icon, opening menu on click */}
                    <div className=" ml-4 pr-0 lg:pr-10">
                        <div className=" rounded-full  " >
                            <Link onClick={logoutUser}>
                                <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    className="w-9 h-9  ">
                                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />

                                </svg> Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Header