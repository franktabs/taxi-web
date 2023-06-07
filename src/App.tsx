import logo from './logo.svg';
import { useContext, ComponentType, createContext } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import "./styles/bootstrap/bootstrap.css";
import './App.css';
import ModalProviderContext from './context/ModalProviderContext';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Dashboard />} />
    </>
  )
)


function App() {
  return (
    <div className="App">
      <ModalProviderContext>
        <RouterProvider router={router} />
      </ModalProviderContext>
    </div>
  );
}

export default App;
