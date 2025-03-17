import { Outlet } from 'react-router-dom';
import { GlobalNavigation } from '../components/global-navigation/GlobalNavigation.component';
import { useGetReferencesQuery } from './api/apiSlice';

const SharedLayout = () => {
  // Load all references prematurely so they are immediately available to all other components
  const { isLoading } = useGetReferencesQuery();
  
  return (
    <main>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <GlobalNavigation />
          <Outlet />
        </>
      )}
    </main>
  );
};

export default SharedLayout;
