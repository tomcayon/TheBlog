import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { BlogName } from '../App';



function AdminNav({username}) {
    const location = useLocation();

    const user = {
        image: "https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        name: "Franc Masson",
        roles: "Administrateur"
      };

    return (
        <>
        <div className="d-flex header-navbar-admin">
            <div className='p-2'>
                <a className='chomsky user-select-none text-decoration-none text-dark h1' href="/">{BlogName()}</a>
            </div>
            {location.pathname === '/admin' && (
                <div className="ms-auto p-2 d-flex align-items-center">
                    <span className="text-capitalize" style={{marginRight:"12px",fontWeight:"bold"}}>{username}</span>
                    {/* <img src={user.image} className="rounded-circle" alt={user.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> */}
                </div>

            )}
            {location.pathname.startsWith('/admin/') && location.pathname !== '/admin' && (
                <div className='ms-auto p-2'>
                    <Link to="/admin" className="text-decoration-none">
                        <button className="btn btn-danger mt-2"><FontAwesomeIcon icon={faXmark} /></button>
                    </Link>
                </div>
            )}
        </div>
        </>
    );
}

export default AdminNav;