import React from 'react';
import { Link } from 'react-router-dom';

function RoleItemList({ role }) {
  function handleEdit() {
    window.location.href = `/admin/edit-role/${role.name}`;
  }

  return (
    <div className="card mb-4" key={role}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="card-body">
          <h3 className="card-title text-capitalize">{role.name}</h3>
          <p className="card-text">{role.users} membres</p>
        </div>
        <button onClick={handleEdit} style={{ marginRight: '2%' }} className="btn btn-primary">Modifier</button>
      </div>
    </div>
  );
}

export default RoleItemList;
