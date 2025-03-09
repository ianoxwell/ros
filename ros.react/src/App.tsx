import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { GlobalNavigation } from './features/global-navigation/global-navigation.component';
import { Ingredients } from './pages/ingredients';
import NotFoundErrorPage from './pages/not-found-error';
import { Orders } from './pages/orders';
import { Recipes } from './pages/recipes';
import { Schedules } from './pages/schedules';

function App() {
  return (
    <>
      <MantineProvider>
        <GlobalNavigation />
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="*" element={<NotFoundErrorPage />} />
        </Routes>
      </MantineProvider>
    </>
  );
}

export default App;
