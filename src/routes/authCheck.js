import Cookies from 'js-cookie';

import { Outlet, Navigate } from "react-router-dom"
const AuthCheck = ({userRole}) => {

  const ppms = Cookies.get('ppms')
  const data = JSON.parse(ppms)
  const permission_ava = data.some(obj => obj.permission_name === userRole);
  
  const builder = () => {
      return (
        <Outlet />
      )
  }
  return permission_ava ? builder() : <Navigate to='/no-access' />
}

export default AuthCheck