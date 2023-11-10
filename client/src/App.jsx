import Navbar from './components/navbar';
import HomePage from './pages/home';
import {Routes, Route, useLocation} from 'react-router-dom';
//Import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css';
import Footer from './components/footer';
import LoginPage from './pages/login';
import MentionsLegalesPage from './pages/mentionslegales';
import ConditionsUtilisationPage from './pages/conditionsutilisation';
import AdminPannelPage from './pages/admin-pannel';
import AdminNav from './components/admin-nav';
import NewArticlePage from './pages/new-article';
import ListArticlePage from './pages/list-article';
import EditArticlePage from './pages/edit-article';
import ArticleReader from './pages/article-read';
import ListUserPage from './pages/list-user';
import NewUserPage from './pages/new-user';
import EditUserPage from './pages/edit-user';
import SettingsPage from './pages/settings';
import CategoryPage from './pages/category';
import { useEffect, useState } from 'react';
import PermReq from './components/PermReq';
import Maintenance from './pages/maintenance';
import NewRolePage from './pages/new-role';

export function Permission(permission) {
  const permissionName = permission;
  const [id, setId] = useState('');
  const [permissionValue, setPermissionValue] = useState(false);
  useEffect(() => {
    fetch('/api',{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setId(data.id);
    })

    fetch(`/api/permissions/${id}/${permissionName}`,{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setPermissionValue(data);
    })
  });
  return permissionValue;
}

export function BlogName() {
  const [blogname, setBlogName] = useState('');

  useEffect(() => {
    fetch('/api/get-name', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogName(data);
      });
  }, []);

  return blogname;
}

export function Logged() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    fetch('/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data === false) {
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return isLogged;
}


function App() {
    // Obtenez l'emplacement courant
    const location = useLocation();
  
    // Vérifiez si l'emplacement commence par "/admin"
    const isAdminRoute = location.pathname.startsWith('/admin');

    const isLoginRoute = location.pathname.startsWith('/login');

    const [username, setUsername] = useState('');

    const [isLogged, setIsLogged] = useState(false);

    const [maintenanceMode, setMaintenanceMode] = useState(false); // État du mode maintenance

    const [CanBypassMaintenance, setCanBypassMaintenance] = useState(false);

    const [id, setId] = useState('');

    useEffect(() => {
      if(isAdminRoute){
        fetch('/api',{
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
          if(data ===false){
            window.location.href = "/login";
            document.cookie = `token=;max-age=0`;
          } else {
            setIsLogged(true);
            setUsername(data.username);
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    }, [isAdminRoute]);

    fetch('/api',{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setId(data.id);
      if(id != ''){
        fetch(`/api/permissions/${id}/BypassMaintenance`,{
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
          setCanBypassMaintenance(data);
        })
      }
    })

    fetch('/api/maintenance',{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data => {
      setMaintenanceMode(data);
    })

    if(!isLogged && isAdminRoute){
      return null;
    }

    if(maintenanceMode && !isAdminRoute && !CanBypassMaintenance && !isLoginRoute){
      return <Maintenance/>;
    }

  return (
    <>
      {isAdminRoute ? <AdminNav username={username} /> : <Navbar/>}
      <div className={isAdminRoute ? "body-admin" : "body"}>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/mentionslegales" element={<MentionsLegalesPage/>}/>
        <Route path="/conditionsutilisation" element={<ConditionsUtilisationPage/>}/>
        <Route path="/article/:id" element={<ArticleReader/>}/>
        <Route path="/category/:category" element={<CategoryPage/>}/>

        <Route path="/admin" element={<AdminPannelPage/>}/>
        <Route path="/admin/new-article" element={<NewArticlePage/>}/>
        <Route path="/admin/list-articles" element={<ListArticlePage/>}/>
        <Route path="/admin/edit-article/:id" element={<EditArticlePage/>}/>
        <Route path="/admin/list-users" element={<PermReq permission={"ViewUsers"}><ListUserPage/></PermReq>}/>
        <Route path="/admin/new-user" element={<NewUserPage/>}/>
        <Route path="/admin/edit-user/:id" element={<EditUserPage/>}/>
        <Route path="/admin/new-role" element={<NewRolePage/>}/>
        <Route path="/admin/settings" element={<SettingsPage/>}/>
      </Routes>
      </div>
      {isAdminRoute ? null : <Footer/>}
    </>
  );
}

export default App
