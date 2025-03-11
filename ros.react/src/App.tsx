import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import Login from '@pages/register/Login';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { GlobalNavigation } from './features/global-navigation/GlobalNavigation.component';
import { Ingredients, NotFoundErrorPage, Orders, Recipes, Schedules } from './pages';

function App() {
  return (
    <>
      <MantineProvider>
        <Notifications position="top-center" limit={5} autoClose={7000} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <GlobalNavigation />
        <Routes>
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          > */}
          <Route path="/" element={<Recipes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/ingredients" element={<Ingredients />} />
          {/* </Route> */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundErrorPage />} />
        </Routes>
      </MantineProvider>
    </>
  );
}

export default App;
