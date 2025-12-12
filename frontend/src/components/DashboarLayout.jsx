import React from 'react'
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import Navbar from './Navbar';

const DashboarLayout = ({activeMenu, children}) => {
    const {user} = useContext(UserContext);
  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && <div className='container mx-auto py-4'>{children}</div>}
    </div>
  )
}

export default DashboarLayout
