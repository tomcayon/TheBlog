import { useEffect, useState } from "react";
import { Permission } from "../App";
import { redirect } from "react-router-dom";

function PermReq({ permission, children }) {
    const [allowed, setAllowed] = useState('');
    const [id, setId] = useState('');
    useEffect(()=>{
        fetch('/api',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            setId(data.id);
        })
        .catch(err => {
            console.log(err);
        });
    },[id])
    useEffect(()=>{
        fetch(`/api/permissions/${id}/${permission}`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            setAllowed(data);
            if(data == false){
                window.location.href = '/admin';
            }
        })
    })

    if(allowed){
        return children;
    } else{
        return null;
    }
}

export default PermReq;