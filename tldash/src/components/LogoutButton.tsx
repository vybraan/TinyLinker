'use client'; 
import { signOut } from 'next-auth/react';

export default function LogoutButton() {

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
    });
  };

  return (
    <button onClick={handleLogout} className="">
      Logout
    </button>
  );
}

