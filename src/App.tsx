import logo from './logo.svg';
import { useContext, ComponentType, createContext } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, redirect } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import "./styles/bootstrap/bootstrap.css";
import './App.css';
import ModalProviderContext from './context/ModalProviderContext';
import Utilisateurs from './pages/Dashboard/Utilisateurs';
import MapDashboard from './pages/Dashboard/MapDashboard';
import { Button } from '@mui/material';
import Login from './pages/autthentication/Login';
import { Provider } from 'react-redux';
import store from './redux/store';
import UserAuthProviderContext from './context/UserAuthProviderContext';
import { authentification } from './utils';





// const q = query(collection(db, "chauffeur"));

// const querySnapshot = await getDocs(q);

// querySnapshot.forEach((doc)=>{
//   console.log(doc.id,"querySnap=>", doc.data());
// })

// const docSnap = await getDocs(collection(db, "chauffeur"));

// docSnap.forEach((doc)=>{
//   console.log(doc.id,"docSnap=>", doc.data());
// })


// // Accéder à la référence de la collection parent
// const parentCollectionRef = firebase.firestore().collection('parentCollection');

// // Accéder à la sous-collection en utilisant la méthode collection()
// const subCollectionRef = parentCollectionRef.doc('documentId').collection('subCollection');

// // Récupérer les documents de la sous-collection
// subCollectionRef.get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//   });
// });



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' loader={({ params, request }) => { return redirect('/dashboard/utilisateurs') }} />
      <Route path='/dashboard' loader={
        ({params, request})=>{
          let userAuth = authentification();
          if(!userAuth){
            return redirect("/login");
          }else{
            return userAuth;
          }
        }
      } element={<Dashboard />}>
        <Route path='utilisateurs' element={<Utilisateurs />} />
        <Route path='notifications' element={<div> <Button variant='contained' color="error" >Notifications</Button> </div>} />
        <Route path='map' element={<MapDashboard />} />
      </Route>
      <Route path='login' loader={
        ({params, request})=>{
          let userAuth = authentification();
          if(userAuth){
            return redirect("/")
          }
          return null
        }
      } element={<Login />} />
    </>
  )
)


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <UserAuthProviderContext>
          <ModalProviderContext>
            <RouterProvider router={router} />
          </ModalProviderContext>
        </UserAuthProviderContext>
      </Provider>
    </div>
  );
}

export default App;
