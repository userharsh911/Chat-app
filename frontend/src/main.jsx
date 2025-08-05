import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider,Route,createBrowserRouter,createRoutesFromElements} from "react-router-dom"
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Authenticated from './components/Authenticated/Authenticated.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import FriendRequest from './pages/FriendRequest.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Home/>}/>
      <Route path='login' element={<Authenticated auth={false}><Login/></Authenticated>}/>
      <Route path='signup' element={<Authenticated auth={false}><Signup/></Authenticated>}/>
      <Route path='profile' element={<Authenticated auth={true}><Profile/></Authenticated>}/>
      <Route path='add-friends' element={<Authenticated auth={true}><FriendRequest/></Authenticated>}/>
      <Route path='settings' element={<Settings/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>,
)
