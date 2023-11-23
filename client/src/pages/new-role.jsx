import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { Permission } from '../App';
import 'react-quill/dist/quill.snow.css'; // CSS for the rich text editor
import form from '../assets/new-role-form.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';

function NewRolePage() {
  const [formData, setFormData] = useState({});
  const [editorValue, setEditorValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionslist, setPermissionsList] = useState([]);

  const handleInputChange = (e) => {
    if (e.target.type === 'checkbox') {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
      return;
    }

    if(e.target.name === "name"){
      // Autoriser uniquement les minuscules
      e.target.value = e.target.value.toLowerCase();
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    id: 'cover',
    accept: {'image/*':[]},
    onDrop: handleImageUpload,
  });

  
  const modules = {
    toolbar: [
      [{ 'header': [] }, { 'size': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'link', 'image', { 'color': [] }],
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'image', 'color',
  ];

  const handleEditorChange = (value) => {
    setEditorValue(value);
    setFormData({ ...formData, article: value });
  };

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
              onChange={handleInputChange}
              required={form[key].id === 'title' || 'name' ? 'required' : ''}
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
              id = {form[key].id}
              placeholder={form[key].placeholder}
              onChange={handleEditorChange}
            />
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
              <button className="btn btn-danger mt-4" onClick={() => setSelectedImage(null)}>Supprimer l'image</button>
            ) : null}
          </div>
        );
      } else if (form[key].type === 'select') {
        return (
            <div className="form-group mt-4" key={index}>
                <select
                    className="form-control"
                    name={form[key].name}
                    id={form[key].id}
                    onChange={handleInputChange}
                    required={form[key].id === 'category' ? 'required' : ''}
                    {...(form[key].id === 'category' ? { defaultValue: article.categorie } : {})}
                >
                    {form[key].options.map((option, index) => (
                      <option 
                      key={index} 
                      value={option.value}
                      disabled={option.value === "published" && !Permission("PublishPosts") ? true : false}
                      >
                        {option.label}
                      </option>
                    ))}
                </select>
            </div>
        );
    } else if (form[key].type === 'permissions') {
      useEffect(() => {
        fetch('/api/permissions-list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setPermissionsList(data);
            
            // Créer un objet temporaire pour contenir les valeurs de permission
            const permissionsData = {};
            data.forEach((permission) => {
              permissionsData[permission] = false;
            });
    
            // Mettre à jour formData avec les valeurs de permission
            setFormData((prevFormData) => ({
              ...prevFormData,
              ...permissionsData,
            }));
          });
      }, []);
        return (
          <div key={index} className="mt-4">
            {permissionslist.map((permission, permissionIndex) => (
              <div key={permissionIndex} className="form-check form-switch">
                <label className="form-check-label" htmlFor={`flexSwitchCheck${permission}`}>
                  {permission}
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={`flexSwitchCheck${permission}`}
                  name={permission}
                  defaultChecked={false} // Mettez la valeur par défaut ici
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        );
    }
      return null;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //post to /api/new-role
    fetch('/api/new-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          window.location.replace('/admin');
        } else {
          // Inserer une erreur dans la div #error
          document.getElementById('error').innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-4" role="alert">Rôle invalide</div>`;
        }
  
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div className="container">
      <h1 className="text-center user-select-none">Nouveau Rôle</h1>
      <form onSubmit={handleFormSubmit}>
        {renderFormFields()}
        <button className="btn btn-dark mt-4" type="submit">
          Enregistrer
        </button>
      </form>
      <div id='error'></div>
    </div>
  );
}

export default NewRolePage;
