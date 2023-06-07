import logo from './logo.svg';
import { useContext, ComponentType, createContext } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, redirect } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import "./styles/bootstrap/bootstrap.css";
import './App.css';
import ModalProviderContext from './context/ModalProviderContext';
import Utilisateurs from './pages/Dashboard/Utilisateurs';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' loader={({params, request})=>{return redirect('/dashboard/utilisateurs')}} />
      <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='utilisateurs' element={<Utilisateurs/>} />
          <Route path='notifications' element={<div>NOTIFICATIONS</div>} />
      </Route>
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
