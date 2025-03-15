import { Card } from '@mantine/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '@app/store';
import './register.scss';
import { setPageNavigate } from '@features/user/userSlice';
import { useDispatch } from 'react-redux';

const AccountWrapper = () => {
  const { user, activePage } = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('checking activePage', activePage);
    if (activePage) {
      setTimeout(() => {
        navigate(activePage);
        dispatch(setPageNavigate(''));
      }, 500);
    }
  }, [dispatch, navigate, activePage]);

  return (
    <main className="account-wrapper">
      <section className="login-section">
        <Card className="action-card" shadow="xs" withBorder radius="md" padding="lg">
          <h1>ROS</h1>
          <Outlet />
        </Card>
      </section>
      <section className="splash-section"></section>
    </main>
  );
};

export default AccountWrapper;
