import { Card } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import './register.scss';

const AccountWrapper = () => {
  return (
    <main className='account-wrapper'>
      <section className="login-section">
        <Card className='action-card' shadow="xs" withBorder radius="md" padding="lg">
          <h1>ROS</h1>
          <Outlet />
        </Card>
      </section>
      <section className="splash-section">

      </section>
    </main>
  );
};

export default AccountWrapper;
