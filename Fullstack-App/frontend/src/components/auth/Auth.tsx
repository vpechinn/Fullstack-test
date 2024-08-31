'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp} from '@/redux/slices/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {useRouter} from 'next/navigation'

import styles from './index.module.scss'
import { setName, setPassword } from '@/redux/slices/accountSlice';

const UserComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [InputName, setInputName] = useState('');
  const [InputPassword, setInputPassword] = useState('');
  const {name, password} = useSelector((state: RootState) => state.accountUser);
  const { status, error } = useSelector((state: RootState) => state.user);
  const router = useRouter();


  const handleSignIn = () => {
    dispatch(signIn({ name, password }));
    router.push('/deeds');
  };

  const handleSignUp = () => {
    dispatch(signUp({ name, password }));
    router.push('/deeds');
  };

  const onChangeInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
    dispatch(setName(event.target.value));
  }

  const onChangeInputPassword = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setInputPassword(event.target.value);
    dispatch(setPassword(event.target.value));
  }

  return (
    <div className={styles.auth}>
      <h2>Авторизация</h2>
      <input
        className={styles.input}
        type="text"
        value={InputName}
        onChange={onChangeInputName}
        placeholder="Name"
      />
      <input
        className={styles.input}
        type="password"
        value={InputPassword}
        onChange={onChangeInputPassword}
        placeholder="Password"
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleSignIn}>Sign In</button>
        <button className={styles.button} onClick={handleSignUp}>Sign Up</button>
        {/*<button className={styles.button} onClick={handleUpdate}>Обновить профиль</button>*/}
      </div>

      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UserComponent;
