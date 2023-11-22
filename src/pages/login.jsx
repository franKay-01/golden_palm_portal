import { useState } from "react";
import { ShowToast } from "../utils/showToast"
import useFunctions from "../utils/functions"
import { useNavigate } from "react-router-dom"

import Cookies from 'js-cookie';

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { adminLogin } = useFunctions();
  const router = useNavigate()

  const changeUsername = (e) => {
    e.preventDefault()
    setUsername(e.target.value)
  }

  const changePassword = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  const submitLogin = async () => {
    if (username === "" || password === ""){
      ShowToast('error', 'All Fields are required')
      return
    }

    setIsLoading(true)

    const params = {
      "username": username,
      "password": password
    }

    const {response_code, admin_name, token} = await adminLogin(params);

    if (response_code === 200){
      
      Cookies.set("username", admin_name);
      Cookies.set("utk", token);
      
      setIsLoading(false)
      router('/')
    }else{
      ShowToast('error', "In-correct username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="flex flex-col lg:justify-center space-y-8 lg:items-center md:justify-center md:items-center lg:pt-44 md:pt-8 lg:pb-0 md:pb-12 md:flex-col lg:flex-row lg:space-x-24 lg:space-y-2 md:space-y-14">
        <div className="flex flex-row justify-center space-y-12">
          <div className="flex flex-col space-y-4">
            <div className="brand-input-box brand-input-box-alt flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input className='main-input-box' name="username" type="text" value={username} onChange={changeUsername} placeholder="username*"/>
            </div>
            <div className="brand-input-box brand-input-box-alt flex flex-row">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              <input className='main-input-box' name="password" type="password" value={password} onChange={changePassword} placeholder="password"/>
            </div>
            <div className='grid justify-center'>
              {isLoading ? 
                <div className="brand-button">
                  <span className="spinner-position spinner-position-alt">
                      <div class="w-6 h-6 rounded-full animate-spin
                        border border-solid border-white border-t-transparent"></div>
                    </span>
                </div> 
              :
                <button className='brand-button mt-8' onClick={() => submitLogin()}>
                  <h1 className='brand-button-text'>Enter</h1>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}