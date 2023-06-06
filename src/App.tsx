import React from 'react';
import logo from './logo.svg';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import "./styles/bootstrap/bootstrap.css";
import './App.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Dashboard/>} />
    </>
  )
)


function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
