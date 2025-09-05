import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import usrImg from '../assets/usr.png'
import { useAuth } from '../hooks'
import LoginModal from './LoginModal'
const Topbar = () => {
  const location = useLocation()
  const path = location.pathname;
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const title = {
    '/': {
      title: 'Shop',
      subtitle: 'Shop > Books',
    },
      
    '/stores': {
      title: 'Stores',
      subtitle: 'Admin > Stores',
    },
    '/author': {
      title: 'Authors',
      subtitle: 'Admin > Authors',
    },
    '/books': {
      title: 'Books',
      subtitle: 'Admin > Books',
    },
    '/store/:storeId': {
      title: 'Store Inventory',
      subtitle: 'Admin > Store Inventory',
    },
    '/browsebooks': {
      title: 'Browse Books',
      subtitle: 'Shop > Books',
    },
    '/browseauthors': {
      title: 'Browse Authors',
      subtitle: 'Shop > Authors',
    },
  }

  return (
    <div className='h-24 border-b border-b-secondary-text flex justify-between items-center'>
      <div className='flex flex-col justify-start items-start '>
        <p className='text-lg text-secondary-text'>{title[path]?.title}</p>
        <p className='font-light text-secondary-text'>{title[path]?.subtitle}</p>

      </div>
      <div className='flex-1 flex justify-end items-center'>
        {isAuthenticated ? (
          <div className='flex items-center'>
            <img src={usrImg} alt="profile" className='ml-4 rounded' />
            <p className='text-secondary-text font-light ml-1 h-full'>{currentUser?.name}</p>
            <button 
              onClick={logout}
              className='ml-4 bg-main text-white rounded px-3 py-1 text-sm'
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className='bg-main text-white rounded px-4 py-2'
          >
            Sign In
          </button>
        )}
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  )
}

export default Topbar