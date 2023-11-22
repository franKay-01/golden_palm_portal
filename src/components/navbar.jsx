import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Logo from '../assets/new/logo.png'
import Cookies from 'js-cookie';

import {Link, NavLink} from 'react-router-dom'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Users', href: '/users', current: false },
  { name: 'Products', href: '/products', current: false }
]

export default function Navbar() {
  const [homeUrl, setHomeUrl] = useState(false)
  const [usersUrl, setUsersUrl] = useState(false)
  const [ordersUrl, setOrdersUrl] = useState(false)
  const [productsUrl, setProductsUrl] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {

    setUsername(Cookies.get("username"))

    const currentUrl = window.location.href;
    let pathway = currentUrl.split('/')[3]

    switch (pathway) {
      case '':
        setHomeUrl(true)
        setUsersUrl(false)
        setOrdersUrl(false)
        setProductsUrl(false)
        break;
      case 'users':
        setHomeUrl(false)
        setUsersUrl(true)
        setOrdersUrl(false)
        setProductsUrl(false)
        break;
      case 'products':
        setHomeUrl(false)
        setUsersUrl(false)
        setOrdersUrl(false)
        setProductsUrl(true)
        break;
      case 'orders':
        setHomeUrl(false)
        setUsersUrl(false)
        setOrdersUrl(true)
        setProductsUrl(false)
        break;
      case 'create-product-page':
        setHomeUrl(false)
        setUsersUrl(false)
        setOrdersUrl(false)
        setProductsUrl(true)
        break;
      case 'edit-product-page':
        setHomeUrl(false)
        setUsersUrl(false)
        setOrdersUrl(false)
        setProductsUrl(true)
        break;
      default:
        setHomeUrl(true)
        setUsersUrl(false)
        setOrdersUrl(false)
        setProductsUrl(false)
        break;
    }
  }, [])
  return (
    
    <Disclosure as="nav" className='nav-bg-custom sticky mobile-nav box-shad w-full left-0 top-0 nav-index'>
      {({ open }) => (
        <>
          <div className="mt-3 mx-auto px-2 sm:px-6 lg:px-8 h-18">
            <div className="relative flex items-center justify-center h-16">
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                  <XIcon className="hidden h-6 w-6" aria-hidden="true" />
                  ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <Link className='z-50' to={"/"}>
                <img className="p-4" src={Logo} alt=""/>
              </Link>
              <div className="flex-1 flex items-center sm:items-stretch justify-center z-1">
                <div className="hidden sm:block">
                  <div className="flex space-x-4 nav-card">
                    <NavLink className={`${homeUrl ? 'nav-bar-text-alt': ''} block px-3 py-2 nav-bar-text`} exact to="/">Home</NavLink>
                    <NavLink className={`${usersUrl ? 'nav-bar-text-alt': ''} block px-3 py-2 nav-bar-text`} exact to="/users">Users</NavLink>
                    <NavLink className={`${productsUrl ? 'nav-bar-text-alt': ''} block px-3 py-2 nav-bar-text`} exact to="/products">Products</NavLink>
                  </div>                  
                </div>
              </div>
              <div className='flex flex-row'>
                <div className="hidden lg:block lg:w-auto mr-4">
                  <h1 className="blog-post-card-header pr-4 pl-4 pt-4">
                    Welcome, {username}!
                  </h1>
                </div>
              </div>
              
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden md:block mobile-nav-bg">
            <div className="px-2 pt-2 pb-3">
              <Disclosure.Button className="inline-flex place-x link-button-position items-center justify-right rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-8 w-8 text-white close-button" aria-hidden="true" />
                  ) : (
                    <img className='w-10' src={MenuIcon} alt=""/>
                  )}
              </Disclosure.Button>

              <div className='link-position'>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className='block link-text px-3 py-2'
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                {/* <a href='/get-started' className="brown-button brown-button-alt link-text">
                  <span className='brown-button-text'>Get Started</span>
                </a> */}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

