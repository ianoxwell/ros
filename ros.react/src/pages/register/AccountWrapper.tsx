import { useAppDispatch } from '@app/hooks';
import { RootState } from '@app/store';
import { setPageNavigate } from '@features/user/userSlice';
import { Card } from '@mantine/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import './register.scss';

const AccountWrapper = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const { user, activePage } = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(base);
      }, 500);
    }
  }, [base, user, navigate]);

  useEffect(() => {
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
