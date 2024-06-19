'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { baseURL } from '@/Url';
import { setUserDetails } from '@/lib/user/userSlice';
import { getCookie } from 'cookies-next';


const UserProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const token = getCookie('accesstoken');

  useEffect(() => {

    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${baseURL}/userauth/info/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      console.log("userdata",userData)
      dispatch(setUserDetails(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return <>{children}</>;
};

export default UserProvider;  

//do this in layout.jsx
{/* <UserProvider>
{children}
</UserProvider> */}