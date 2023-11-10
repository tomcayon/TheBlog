import React, { useEffect, useState } from 'react';
import "../assets/style.css";

function SettingsPage() {

  const [blogName, setBlogName] = useState('');

  const [categories, setCategories] = useState([
    'Catégorie 1',
    'Catégorie 2',
    'Catégorie 3',
  ]);
  const [newCategory, setNewCategory] = useState('');

  const [maintenanceWindow, setMaintenanceWindow] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

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
    
    fetch('/api/maintenance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMaintenanceMode(data);
        console.log(data);
    });
  }, []);

  const handleBlogNameChange = () => {
    let blog = document.getElementById('name').value;
  
    // Utilisez fetch sans utiliser useEffect ici
    fetch('/api/update-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //send name to server
      body: JSON.stringify({ name: blog }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          window.location.reload();
        }
    });
  };
  

  const handleCategoryAdd = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleCategoryDelete = (category) => {
    const updatedCategories = categories.filter((item) => item !== category);
    setCategories(updatedCategories);
  };

  const handleMaintenanceWindow = () => {
    if(maintenanceWindow === false){
      setMaintenanceWindow(true);
    } else {
      setMaintenanceWindow(false);
    }
    
  }

  const handleCancel = () => {
    setMaintenanceWindow(false);
  }

  const handleConfirm = () => {
    if(maintenanceMode === false){
      setMaintenanceMode(true);
      setMaintenanceWindow(false);
      fetch('/api/maintenance/true', {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          window.location.reload();
        }
      });
    } else {
      setMaintenanceMode(false);
      setMaintenanceWindow(false);
      fetch('/api/maintenance/false', {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          window.location.reload();
        }
      });
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Paramètres du Blog</h1>
      <div className="mb-4">
        <h2>Changer le nom du blog</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nouveau nom du blog"
            value={blogName}
            id="name"
            name="name"
            onChange={(e) => setBlogName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleBlogNameChange}
          >
            Enregistrer
          </button>
        </div>
      </div>
      <div>
        <h2>Gérer les catégories</h2>
        <ul className="list-group">
          {categories.map((category, index) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
              {category}
              <button
                className="btn btn-danger"
                onClick={() => handleCategoryDelete(category)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={handleCategoryAdd}
          >
            Ajouter
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h2>Mode Maintenance</h2>
        <button
          className={`btn ${maintenanceMode ? 'btn-danger' : 'btn-warning'}`}
          onClick={handleMaintenanceWindow}
        >
          {maintenanceMode ? 'Désactiver le mode maintenance' : 'Activer le mode maintenance'}
        </button>
      </div>
      {maintenanceWindow && (                
        <div className="popup">
          <div className="popup-content">
            <p>{maintenanceMode ? "Vouslez-vous désactiver le mode maintenance ?" : "Voulez-vous activer le mode maintenance ?"}</p>
            <button className="btn btn-danger" onClick={handleConfirm}>Oui</button>
            <button className="btn btn-primary" onClick={handleCancel}>Annuler</button>
          </div>
        </div>)}
    </div>
  );
}

export default SettingsPage;
