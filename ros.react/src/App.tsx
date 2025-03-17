import SharedLayout from '@features/SharedLayout';
import { colorsTuple, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Ingredients } from '@pages/Ingredients';
import NotFoundErrorPage from '@pages/not-found-error';
import { Orders } from '@pages/Orders';
import ProtectedRoute from '@pages/ProtectedRoute';
import { Recipes } from '@pages/recipes/Recipes';
import AccountWrapper from '@pages/register/AccountWrapper';
import ForgotPassword from '@pages/register/ForgotPassword';
import Login from '@pages/register/Login';
import ResetPassword from '@pages/register/ResetPassword';
import VerifyEmail from '@pages/register/VerifyEmail';
import { Schedules } from '@pages/Schedules';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { CRoutes } from './app/routes.const';

const theme = createTheme({
  primaryColor: 'accent',
  colors: {
    accent: colorsTuple('#128758')
  }
});

function App() {
  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={7000} zIndex={1001} />
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
            <Route path={CRoutes.orders} element={<Orders />} />
            <Route path={CRoutes.schedule} element={<Schedules />} />
            <Route path={CRoutes.ingredients} element={<Ingredients />} />
          </Route>
          <Route path="/" element={<AccountWrapper />}>
            <Route path={CRoutes.login} element={<Login />} />
            <Route path={CRoutes.forgotPassword} element={<ForgotPassword />} />
            <Route path={CRoutes.verifyEmail} element={<VerifyEmail />} />
            <Route path={CRoutes.resetPassword} element={<ResetPassword />} />
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
