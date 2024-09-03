import { Outlet, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { useEffect } from "react";

const AuthLayout = () => {
    const navigate = useNavigate();
    let user = useSelector(state => state.user.value)

    useEffect(() => {
        if(user) {
            navigate("/") 
        }
    }, [user])

    return (
        <Outlet />
    )
}

export default AuthLayout