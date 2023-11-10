import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import form from '../assets/new-user-form.json';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';

function EditUserPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [usernameValue, setUsernameValue] = useState('');
  const [roleValue, setRoleValue] = useState('author');
  const [error, setError] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    // Utilisez l'ID de l'utilisateur (id) pour récupérer les données de l'utilisateur depuis votre API ou source de données.
    // Remplacez la logique suivante par la logique de récupération réelle.
    fetch(`/api/get-user/${id}`)
      .then((response) => response.json())
      .then((user) => {
        console.log(user);
        setFormData(user);
        setUsernameValue(user.username);
        setRoleValue(user.roles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'name') {
      setUsernameValue(e.target.value);
    }
    if (e.target.name === 'role') {
      setRoleValue(e.target.value);
    }
  };

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
  };


  // ... Autres fonctions de gestion des champs du formulaire

  const renderFormFields = () => {
    return Object.keys(form).map((key, index) => {
      if (form[key].type === 'text' || form[key].type === 'password') {
        return (
          <div className="form-group mt-4" key={index}>
            <input
              type={form[key].type}
              className="form-control"
              placeholder={form[key].placeholder}
              name={form[key].name}
              id={form[key].id}
              value={form[key].id === 'name' ? usernameValue : formData[form[key].name]}
              onChange={handleInputChange}
              required={form[key].id === 'name' ? 'required' : ''}
            />
          </div>
        );
      } else if (form[key].type === 'editor') {
        return (
          <div className="form-group mt-4" key={index}>
            <ReactQuill
              value={editorValue}
              modules={modules}
              formats={formats}
              placeholder={form[key].placeholder}
              onChange={handleEditorChange}
            />
          </div>
        );
      } else if (form[key].type === 'select') {
        return (
          <div className="form-group mt-4" key={index}>
            <select
              className="form-control"
              name={form[key].name}
              id={form[key].id}
              value={form[key].id === 'role' ? roleValue : formData[form[key].name]}
              onChange={handleInputChange}
              required={form[key].id === 'title' ? 'required' : ''}
            >
              <option value="" disabled hidden>
                {form[key].placeholder}
              </option>
              {form[key].options.map((option, optionIndex) => {
                return (
                  <option value={option.value} key={optionIndex}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        );
      } else if (form[key].type === 'image') {
        return (
          <div className="form-group mt-4" key={index}>
            <div {...getRootProps()} className="card dropzone">
              <div className="card-body">
                <input {...getInputProps()} />
                {selectedImage ? (
                  <div className="mt-4">
                    <img src={selectedImage} alt="Selected" className="container-sm img-fluid" />
                  </div>
                ) : (
                  <div className="drag-card text-center">
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-black-50" size="3x" />
                    <p className="text-black-50 user-select-none">Faites glisser et déposez une image ici ou cliquez pour sélectionner une image</p>
                  </div>
                )}
              </div>
            </div>
            {selectedImage ? (
              <button className="btn btn-danger mt-4" onClick={() => setSelectedImage(null)}>
                Supprimer l'image
              </button>
            ) : null}
          </div>
        );
      }
      return null;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Mettez à jour formData avec les valeurs de username et role
    formData.username = usernameValue;
    formData.role = roleValue;
    delete formData.roles; // Supprimez la propriété "roles" si elle existe
  
    // Ensuite, vous pouvez envoyer les données modifiées au serveur
    fetch(`/api/edit-user/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data === true){
          window.location.href = "/admin/list-users";
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  function handleDelete() {
    setPopup(true);
  }

  function handleCancel() {
    setPopup(false);
  }

  function handleConfirm() {
    fetch(`/api/delete-user/${id}`, {
      method: 'post',
    })
    .then(response => response.json())
    //If response = true go to /admin
    .then(data => {
      if (data === true) {
        window.location.href = "/admin/list-users";
      }
    })

  }
  

  return (
<div className="container">
  <h1 className="text-center user-select-none">Éditer Utilisateur</h1>
  <form onSubmit={handleFormSubmit}>
    {renderFormFields()}
    <div className="d-flex justify-content-between align-items-center mt-4">
      <button className="btn btn-dark" type="submit">
        Enregistrer
      </button>
      <button className="btn btn-danger" type="button" onClick={handleDelete}>Supprimer</button>
    </div>
    <div className="alert alert-danger mt-4" role="alert" style={{ display: error ? 'block' : 'none' }}>
      Erreur lors de la soumission du formulaire
    </div>
  </form>
  {popup ? 
    (<div className="popup">
    <div className="popup-content">
      <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
      <button className="btn btn-danger" onClick={handleConfirm}>Oui</button>
      <button className="btn btn-primary" onClick={handleCancel}>Annuler</button>
      </div>
    </div>): null}
    </div>
    )
}

export default EditUserPage;
