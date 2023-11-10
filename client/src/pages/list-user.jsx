import { useEffect, useState } from "react";
import UserItemList from "../components/user-item-list";
import { Link } from "react-router-dom";

function ListUserPage(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/get-users')
        .then(res => res.json())
        .then(data => {
            setUsers(data);
        })
        .catch(err => {
            console.log(err);
        });
    });

    return (
        <>
        <h1 className="text-center mb-4">Liste des Utilisateurs</h1>
        <div className="d-flex mb-4">
            <Link to="/admin/new-user" className="btn btn-primary">Ajouter un Utilisateur</Link>
        </div>
        <div className="row">
            {users.map(user => (
                    <UserItemList key={user.id} user={user} />
            ))}
        </div>
        </>
    )
}

export default ListUserPage;