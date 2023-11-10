import React from 'react';
import { Link } from 'react-router-dom';

function UserItemList({ user }) {
  function handleEdit() {
    window.location.href = `/admin/edit-user/${user.id}`;
  }

  return (
    <div className="card mb-4" key={user.id}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="card-body">
          <h2 className="card-title text-capitalize">{user.username}</h2>
          <div className="card-text">
            <p className='text-capitalize'>{user.roles}</p>
          </div>
        </div>
        <button onClick={handleEdit} style={{ marginRight: '2%' }} className="btn btn-primary">Modifier</button>
      </div>
    </div>
  );
}

export default UserItemList;
