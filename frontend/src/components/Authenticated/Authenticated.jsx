import React, { useEffect } from 'react'
import useBearStore from '../../store/store'
import { useNavigate } from 'react-router-dom';

const Authenticated = ({children,auth=true}) => {
    const navigate = useNavigate();
    const {userAuth} = useBearStore((state) => state);
    useEffect(()=>{
        if(!userAuth && userAuth != auth){
            navigate('/login');
        }
        else if(userAuth && !userAuth==auth) navigate('/')
    },[userAuth,auth])

    return (
    <>
        {children}
    </>
  )
}

export default Authenticated