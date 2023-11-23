import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import form from '../assets/new-role-form.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faEdit } from '@fortawesome/free-solid-svg-icons';

function EditRolePage() {
  // Get param
  const { id } = useParams();
  const [role, setRole] = useState({});
  const [formData, setFormData] = useState({});
  const [userslist, setUsersList] = useState([]);
  const [Querrylist, setQuerrylist] = useState([]);

  useEffect(() => {
    fetch('/api/role/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data);
        setFormData(data);
      })
      .catch((err) => {
        console.error(err);
        window.location.href = '/admin/roles';
      });
    fetch('/api/list-users-role/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsersList(data);
      })
    fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        // Pour chaque élément dans data, mettre dans une liste le data.username s'il n'est pas dans userslist puis mettre la liste dans setQuerrylist
        let list = [];
        data.forEach(element => {
          // Check if the username is in userslist
          if (userslist.some(user => user.username === element.username)) {
            return;
          } else {
            list.push(element.username);
          }
        });
        setQuerrylist(list);
      })
  }, [id, userslist]);


  const handleInputChange = (e) => {
    if (e.target.type === 'checkbox') {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
      return;
    }

    if (e.target.name === 'name') {
      // Autoriser uniquement les minuscules
      e.target.value = e.target.value.toLowerCase();
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter dans le formdata le nom du rôle (id)
    useEffect(() => {
        setFormData({ ...formData, name: id });
        }, [id]);

  const renderFormFields = () => {
    return Object.keys(form).map((key, index) => {
      if (form[key].type === 'text') {
        return (
          <div className="form-group mt-4" key={index}>
            <input
              type="text"
              className="form-control"
              placeholder={form[key].placeholder}
              name={form[key].name}
              id={form[key].id}
              value={formData[form[key].name]}
              onChange={handleInputChange}
              required={form[key].id === 'title' || form[key].id === 'name' ? 'required' : ''}
            />
          </div>
        );
      } else if (form[key].type === 'permissions') {
        return Object.keys(role).map((permission, index) => (
            <div key={index} className="form-check form-switch">
              <label className="form-check-label" htmlFor={`${permission}`}>
                {permission}
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={`${permission}`}
                name={permission}
                checked={formData[permission]}
                onChange={handleInputChange}
              />
            </div>
          ));
      }
      return null;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Ajoutez le code pour envoyer les données du formulaire à l'API
  };

  const renderUserList =() => {
    // Make card in list for each user
    return userslist.map((user, index) => (
        <div className="card mb-2" key={index}>
            <div className="card-body d-flex justify-content-between align-items-center">
            <span>{user.username}</span>
            <div className="d-flex">
                <a href={`/admin/edit-user/${user.id}`} className="btn btn-primary">
                <FontAwesomeIcon icon={faEdit}/>
                </a>
                <button className="btn btn-danger" style={{marginLeft:"12px"}} onClick={() => handleRemoveRole(user.id)}>
                <FontAwesomeIcon icon={faUserMinus} />
                </button>
            </div>
            </div>
        </div>
    ));
  }

  console.log(Querrylist);
  console.log(userslist)

  return (
    <div className="container">
      <h1 className="text-center user-select-none">Modifier {id}</h1>
      <form onSubmit={handleFormSubmit}>
        {renderFormFields()}
        <button className="btn btn-dark mt-4" type="submit">
          Enregistrer
        </button>
      </form>
      <div id="error"></div>
      <div className="mt-4">
        <h2 className="text-center user-select-none">Utilisateurs</h2>
        <form>
            <select
                className="form-control mb-4 selectpicker"
                value={formData.selectedUser || ''}
                data-live-search="true"
                aria-label="Default select example"
            >
                <option value="" disabled>Sélectionnez un utilisateur</option>
                {Querrylist.map((item, index) => (
                <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </form>
        {renderUserList()}
      </div>
    </div>
  );
}

export default EditRolePage;
