import { Outlet } from 'react-router-dom';
import { GlobalNavigation } from './global-navigation/GlobalNavigation.component';

const SharedLayout = () => {
  console.log('blah blah shared layout');
  // TODO load the measurements and references here - RTK query?
  return (
    <main>
      <GlobalNavigation />
      <Outlet />
    </main>
  );
};

export default SharedLayout;
