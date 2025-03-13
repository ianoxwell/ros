import { Outlet } from 'react-router-dom';
import { GlobalNavigation } from './global-navigation/GlobalNavigation.component';

const SharedLayout = () => {
  return (
    <main>
      <GlobalNavigation />
      <Outlet />
    </main>
  );
};

export default SharedLayout;
