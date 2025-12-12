import React from 'react'
import Modal from '@/components/Modal';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { landingPageStyles } from '@/assets/dummystyle';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const hoi = () => {
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const handleCTA = () => {
       if (user) {
         navigate("/dashboard");
       } else {
         setOpenAuthModal(true);
       }
     };
  return (
    <div>
    <button
    className={landingPageStyles.primaryButton}
    onClick={handleCTA}
  >
    <div className={landingPageStyles.primaryButtonOverlay}></div>
    <span className={landingPageStyles.primaryButtonContent}>
      Start build
      <ArrowRight
        className={landingPageStyles.primaryButtonIcon}
        size={20}
      />
    </span>
  </button>
<Modal isOpen={openAuthModal} onClose={() => {
setOpenAuthModal(false)
setCurrentPage("login")
}} hideHeader>
<div>
{currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
{currentPage === "register" && <Register setCurrentPage={setCurrentPage} />}
</div>
</Modal>
</div>
  )
}

export default hoi