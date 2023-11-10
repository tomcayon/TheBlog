import React from 'react';
import { Link } from 'react-router-dom';

function Maintenance() {
  return (
    <>
    <div className="container" style={{ height: '80vh' }}>
      <div className="row align-items-center" style={{ height: '100%' }}>
        <div className="col-12 text-center">
          <h1 className="h1">Site en maintenance</h1>
          <p className="lead">Nous travaillons actuellement sur le site pour l'améliorer. Veuillez revenir plus tard.</p>
        </div>
      </div>
    </div>
    <div className="fixed-bottom text-center mb-3">
        <Link to="/login" className="text-secondary">Connexion</Link>
    </div>
    </>
  );
}

export default Maintenance;
