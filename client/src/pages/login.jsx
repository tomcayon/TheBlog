import React, { useEffect, useState } from 'react';
import formData from '../assets/login-form.json'; // Assurez-vous que le chemin du fichier JSON est correct
import { faL } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {

  useEffect(() => {
    //if user is already logged in redirect to admin pannel
    fetch('/api',{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })  
    .then(res => res.json())
    .then(data => {
      if(data !== false){
        window.location.href = "/admin";
      }
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const [formDataState, setFormDataState] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormDataState({ ...formDataState, [name]: value });
  }

  const handleSubmit = (event) => {
    document.querySelector('.alert').style.display = 'none';
    event.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataState),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data == false){
          document.querySelector('.alert').style.display = 'block';
          return;
        }
        //get data (token) and set cookie 1 day 
        const token = data.token;
        document.cookie = `token=${token};max-age=25200`;
        //redirect to admin pannel
        window.location.href = "/admin";
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Invalid username or password');
      });
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form onSubmit={handleSubmit} className="mt-5">
            <h2 className="text-center mb-4">Connexion</h2>
            {Object.keys(formData).map((field) => (
              <div className="form-group mb-4" key={field}>
                <input
                  type={formData[field].type}
                  className="form-control"
                  id={formData[field].id}
                  name={field}
                  placeholder={formData[field].placeholder}
                  value={formDataState[field] || ''}
                  onChange={handleInputChange}
                  required="required"
                />
              </div>
            ))}
            <div className="alert alert-danger" style={{ display: 'none' }}>
              Identifiant incorrect
            </div>
            <button type="submit" className="btn btn-dark btn-block">Se Connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
