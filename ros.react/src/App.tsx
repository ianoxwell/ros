import SharedLayout from '@features/SharedLayout';
import { colorsTuple, createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import IngredientModal from '@pages/ingredients/IngredientModal';
import { IngredientsPage } from '@pages/ingredients/IngredientsPage';
import NotFoundErrorPage from '@pages/not-found-error';
import { Orders } from '@pages/Orders';
import ProtectedRoute from '@pages/ProtectedRoute';
import RecipeModal from '@pages/recipes/RecipeModal';
import { RecipesPage } from '@pages/recipes/RecipesPage';
import AccountWrapper from '@pages/register/AccountWrapper';
import ForgotPassword from '@pages/register/ForgotPassword';
import Login from '@pages/register/Login';
import ResetPassword from '@pages/register/ResetPassword';
import VerifyEmail from '@pages/register/VerifyEmail';
import { SchedulesPage } from '@pages/schedules/SchedulesPage';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { CRoutes } from './app/routes.const';

const theme = createTheme({
  fontFamily: 'Quicksand, sans-serif',
  primaryColor: 'accent',
  colors: {
    accent: colorsTuple('#128758')
  },
  breakpoints: {
    xs: '37em',
    sm: '48em',
    md: '68em',
    lg: '80em',
    xl: '125em'
  }
});

function App() {
  const base = import.meta.env.VITE_BASE_URL;
  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={7000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <ModalsProvider>
          <Routes>
            <Route
              path={base}
              element={
                <ProtectedRoute>
                  <SharedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RecipesPage />} />
              <Route path={CRoutes.orders} element={<Orders />} />
              <Route path={CRoutes.schedule} element={<SchedulesPage />} />
              <Route path={CRoutes.ingredients} element={<IngredientsPage />} />
              <Route
                path={`${CRoutes.ingredients}/:id`}
                element={
                  <>
                    <IngredientsPage />
                    <IngredientModal />
                  </>
                }
              />
              <Route
                path={`${CRoutes.recipe}/:id`}
                element={
                  <>
                    <RecipesPage />
                    <RecipeModal />
                  </>
                }
              />
            </Route>
            <Route path={base} element={<AccountWrapper />}>
              <Route path={CRoutes.login} element={<Login />} />
              <Route path={CRoutes.forgotPassword} element={<ForgotPassword />} />
              <Route path={CRoutes.verifyEmail} element={<VerifyEmail />} />
              <Route path={CRoutes.resetPassword} element={<ResetPassword />} />
            </Route>
            {/* TODO add in the rest of the registration bits here */}
            {/* TODO - make sure the registration flow in the API does not send back anything useful like logging in - should show something about email should be sent... */}
            <Route path="*" element={<NotFoundErrorPage />} />
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
