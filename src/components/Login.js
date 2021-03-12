import React, { useState } from 'react';
import {Link, Redirect} from "react-router-dom";
const Login = props => {
    const [user, setUser] = useState({
        email:'',
        password:''
    });

    const handleInputChange = event => {
        const { name, value } = event.target
        setUser({ ...user, [name]: value })
    };
    if(props.loggedIn===true){
        return <Redirect to="/"></Redirect>
    }
    return (
        <div className={"container"}>
        <form className="form" autoComplete="off" >
            <div className={"form-group"}>
                <input className= "form-control w-50 mb-2" type="text" name="email" placeholder="email" value={user.email} onChange={handleInputChange} ></input>
            </div>
            <div className={"form-group"}>
                <input className= "form-control w-50 mb-2" type="text" name="password" type="password"  placeholder="password" value={user.password} onChange={handleInputChange} ></input>
            </div>
            <Link to ="/"> <button className="btn btn-success mt-2 mr-2 w-25" onClick={()=> {
                if (!user.email|| !user.password) return;
                props.logIn(user)
            }}>Log In</button></Link>
            <Link to ="/"><button  className={"btn btn-danger mt-2 w-25"}>Cancel</button></Link>
        </form>
        </div>
    )
}
export default Login;