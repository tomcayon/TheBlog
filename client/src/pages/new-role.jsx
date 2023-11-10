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
              required={form[key].id === 'title' ? 'required' : ''}
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
                console.log(data)
                console.log(permissionslist)
              });
          }, []);
        return (
            <div className="mt-4 form-check form-switch">
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Default switch checkbox input</label>s
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
            </div>
        );
    }
      return null;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
   
  };


  return (
    <div className="container">
      <h1 className="text-center user-select-none">Nouveau Rôle</h1>
      <form onSubmit={handleFormSubmit}>
        {renderFormFields()}
        <button className="btn btn-dark mt-4" type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default NewRolePage;
