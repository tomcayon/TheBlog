import React, { useEffect, useState } from 'react';
import { Permission } from '../App';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import form from '../assets/new-article-form.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import Dropzone, { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';

function EditArticlePage() {
    const delta = new Delta();

    const { id } = useParams();
    const [article, setArticle] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [editorValue, setEditorValue] = useState(delta); // Initialize editorValue with a Delta instance
    const [titleValue, setTitleValue] = useState(article.titre || ''); // Utilisez la valeur existante ou une chaîne vide
    const [statusValue, setStatusValue] = useState(article.status || 'draft'); // Utilisez la valeur existante ou "brouillon"


    useEffect(() => {
        fetch(`/api/articles/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setArticle(data);
                setEditorValue(data.contenu);
                setTitleValue(data.titre || ''); // Mettez à jour titleValue avec la valeur existante ou une chaîne vide
                setStatusValue(data.status || 'draft'); // Mettez à jour statusValue avec la valeur existante ou "brouillon"
                if (data.couverture) {
                    setSelectedImage(`/api/cover/${data.couverture}`);
                }
            });
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }

    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'title') {
            setTitleValue(e.target.value);
        }
        if (e.target.name === 'status') {
            setStatusValue(e.target.value);
            console.log(statusValue);
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

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        id: 'cover',
        accept: { 'image/*': [] },
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
                            {...(form[key].id === 'title' ? { defaultValue: article.titre } : {})}
                        />
                    </div>
                );
            } else if (form[key].type === 'editor') {
                return (
                    <div className="form-group mt-4" key={index}>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            id={form[key].id}
                            name={form[key].name}
                            placeholder={form[key].placeholder}
                            onChange={handleEditorChange}
                            value={editorValue} // Use editorValue as value
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
                                        <p className="text-black-50 user-select-none">
                                            Faites glisser et déposez une image ici ou cliquez pour sélectionner une image
                                        </p>
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
            } else if (form[key].type === 'select') {
                return (
                    <div className="form-group mt-4" key={index}>
                        <select
                            className="form-control"
                            name={form[key].name}
                            id={form[key].id}
                            onChange={handleInputChange}
                            required= {form[key].id === 'status' ? 'required' : ''}
                            value={statusValue}
                        >
                            {form[key].options.map((option, index) => (
                                <option key={index} value={option.value} disabled={option.value === "published" && !Permission("PublishPosts") ? true : false}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            }
            return null;
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', titleValue);
        formData.append('content', editorValue);
        formData.append('status', statusValue)
        if (acceptedFiles[0]) {
            formData.append('cover', acceptedFiles[0]);
        }
    
        fetch(`/api/update-article/${id}`, {
            method: 'POST',
            body: formData, // Utilisation de FormData
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Succès :', result);
                if (result === true) {
                    window.location.replace('/admin/list-articles');
                }
            })
            .catch((error) => {
                console.error('Erreur :', error);
            });
    };

    return (
        <div className="container">
            <h1 className="text-center user-select-none">Editer un article</h1>
            <form onSubmit={handleFormSubmit}>
                {renderFormFields()}
                <button className="btn btn-dark mt-4" type="submit">
                    Envoyer
                </button>
            </form>
        </div>
    );
}

export default EditArticlePage;
