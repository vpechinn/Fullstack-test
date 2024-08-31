'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDeed, fetchDeeds, updateDeed, deleteDeed, addFriend, fetchFriendDeeds } from '@/redux/slices/deedsSlice';
import { AppDispatch, RootState } from '@/redux/store';

import styles from './index.module.scss'
import { deleteUser, updateUser } from '@/redux/slices/userSlice';
import {setPassword} from '@/redux/slices/accountSlice';

const DeedsComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  const [editDeedId, setEditDeedId] = useState<string | null>(null);
  const [inputDescription, setInputDescription] = useState<string | null>('');

  const [friendId, setFriendId] = useState('');
  const [friendIdDeed, setFriendIdDeed] = useState<string | null>('');

  const { deeds, status, error, friendDeeds } = useSelector((state: RootState) => state.deeds);
  const {name, password} = useSelector((state:RootState) => state.accountUser);
  const userId : string | null = useSelector((state: RootState) => state.user.userId)


  useEffect(() => {
    dispatch(fetchDeeds());
  }, [dispatch]);

  const handleAddFriend = () => {
      // @ts-ignore
    dispatch(addFriend({ userId, friendId }));
  };

  const handleFetchFriendsDeeds = () => {
      // @ts-ignore
    dispatch(fetchFriendDeeds({userId, friendIdDeed}));

  }

  const handleCreateDeed = () => {
    dispatch(createDeed({ title, description }))
      .then(() => {
        dispatch(fetchDeeds());
      });
  };

  const handleDeleteDeed = (deedId: string) => {
    dispatch(deleteDeed(deedId))
      .then(() => {
        dispatch(fetchDeeds());
      });
  };

  const handleUpdateDeed = (deedid: string) => {
   if (inputDescription) {
     dispatch(updateDeed({ deedid, title, description: inputDescription }))
       .then(() => {
         setEditDeedId(null);
         dispatch(fetchDeeds());
       });
   } else {
     console.log("assignable null yo string")
   }
  };


  const handleUpdate = () => {
    dispatch(updateUser({ name, password }));
  };


  const handleDelete = () => {
    dispatch(deleteUser());
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(inputPassword))
    setInputPassword(event.target.value)
  }


  return (
    <>
      <aside>
        <div>User:{name}</div>
        <button className={styles.button}  onClick={handleDelete}>Удалить пользователя</button>
        <button className={styles.button} onClick={e => setChangePassword(!changePassword)}>Изменить пароль</button>
        {changePassword && (
          <>
            <input
              type="text"
              className={styles.input}
              value={inputPassword}
              onChange={onChangeInput}
              placeholder="password"
            />
            <button className={styles.button} onClick={handleUpdate}>Изменить</button>
          </>
        )
        }
      </aside>
      <div className={styles.deeds}>
        <h2>Управление делами</h2>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button className={styles.button} onClick={handleCreateDeed}>Создать дело</button>

        {status === 'loading' && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <ul className={styles.list}>
          <p>Список дел</p>
          {deeds.map((deed) => (
            <li key={deed.deedid}>
              <h3>Название дела: {deed.title}</h3>
              <p>Описание дела: {deed.description}</p>

              {editDeedId === deed.deedid ? (
                <>
                  <input
                    type="text"
                    value={inputDescription || ''}
                    onChange={(e) => setInputDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <button className={styles.button} onClick={() => handleUpdateDeed(deed.deedid)}>Изменить</button>
                </>
              ) : (
                <button className={styles.button} onClick={() => {
                  setEditDeedId(deed.deedid);
                  setInputDescription(deed.description);
                }}>Изменить</button>
              )}

              <button className={styles.button} onClick={() => handleDeleteDeed(deed.deedid)}>Удалить</button>
            </li>
          ))}
        </ul>
        <div>
          <h2>Add a Friend</h2>
          <input
            className={styles.input}
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="Friend ID"
          />
          <button className={styles.button} onClick={handleAddFriend}>Добавить друга</button>
          <div>
            <input
              className={styles.input}
              type="text"
              value={friendIdDeed || ''}
              onChange={(e) => setFriendIdDeed(e.target.value)}
              placeholder="Friend ID"
            />
            <button className={styles.button} onClick={handleFetchFriendsDeeds}>Добавить список дел друга</button>
            <ul className={styles.list}>
              <p>Список дел</p>
              {friendDeeds.map((deed) => (
                <li key={deed.deedid}>
                  <h3>Название дела: {deed.title}</h3>
                  <p>Описание дела: {deed.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeedsComponent;
