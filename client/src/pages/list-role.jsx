import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoleItemList from '../components/role-item-list';

// ...

function ListRolePage() {
const [roles, setRoles] = useState([]);

useEffect(() => {
    fetch('/api/user-roles', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        setRoles(data);
    })
    .catch((error) => {
        console.error('Error fetching user roles:', error);
        // Gérer l'erreur ici (peut-être afficher un message d'erreur à l'utilisateur)
    });
}, []);

return (
    <>
    <h1 className="text-center mb-4">Liste des Rôles</h1>
    <div className="d-flex mb-4">
        <Link to="/admin/new-role" className="btn btn-primary">
        Ajouter un Rôle
        </Link>
    </div>
    <div className="row">
        {roles.map((role) => (
        <RoleItemList key={role.name} role={role} />
        ))}
    </div>
    </>
);
}
  

  

export default ListRolePage;