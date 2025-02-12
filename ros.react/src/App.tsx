import '@mantine/core/styles.css';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { GlobalNavigation } from './features/global-navigation/global-navigation.component';
import { Ingredients } from './pages/ingredients';
import { Orders } from './pages/orders';
import { Recipes } from './pages/recipes';
import { Schedules } from './pages/schedules';

function App() {
  return (
    <>
      <GlobalNavigation />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/schedule" element={<Schedules />} />
        <Route path="/ingredients" element={<Ingredients />} />
      </Routes>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR bit and stuffer
        </p>
      </div>
      <p className="read-the-docs">
        Recipes, orders, schedule, ingredients,
      </p> */}
    </>
  );
}

export default App;
