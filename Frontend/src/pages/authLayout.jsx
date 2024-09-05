import { Outlet } from "react-router-dom"
import { useSelector } from 'react-redux'
import { useEffect } from "react";

const AuthLayout = () => {
    let user = useSelector(state => state.user.value)

    useEffect(() => {
        if(user) {
            window.location.href = "/home"
        }
    }, [user])

    return (
        <Outlet />
    )
}

export default AuthLayout