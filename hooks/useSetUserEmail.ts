// hooks/useSetUserEmail.ts
"use client"
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { setUserEmail } from '../store/useSlice';

const useSetUserEmail = () => {
  const { user } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUserEmail(user.emailAddresses[0].emailAddress));
    }
  }, [user, dispatch]);
};

export default useSetUserEmail;
