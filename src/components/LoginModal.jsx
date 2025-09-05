import React from 'react';
import Modal from './Modal';
import Login from './Login';

const LoginModal = ({ isOpen = false, onClose }) => {
  return (    

    isOpen &&  <Login onClose={onClose} />
  );
};

export default LoginModal;