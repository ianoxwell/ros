import SharedLayout from '@features/SharedLayout';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Ingredients } from '@pages/Ingredients';
import NotFoundErrorPage from '@pages/not-found-error';
import { Orders } from '@pages/Orders';
import ProtectedRoute from '@pages/ProtectedRoute';
import { Recipes } from '@pages/Recipes';
import Login from '@pages/register/Login';
import { Schedules } from '@pages/Schedules';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import AccountWrapper from '@pages/register/AccountWrapper';
import VerifyEmail from '@pages/register/VerifyEmail';
import ForgotPassword from '@pages/register/ForgotPassword';
import ResetPassword from '@pages/register/ResetPassword';

function App() {
  return (
    <>
      <MantineProvider>
        <Notifications position="top-center" limit={5} autoClose={7000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Recipes />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/schedule" element={<Schedules />} />
            <Route path="/ingredients" element={<Ingredients />} />
          </Route>
          <Route path="/" element={<AccountWrapper />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          {/* TODO add in the rest of the registration bits here */}
          {/* TODO - make sure the registration flow in the API does not send back anything useful like logging in - should show something about email should be sent... */}
          {/* TODO review the lessons on Redux Toolkit - chapter 14 */}
          <Route path="*" element={<NotFoundErrorPage />} />
        </Routes>
      </MantineProvider>
    </>
  );
}

export default App;
