import React from "react";
import {Link} from "react-router-dom";
const NavBar = props => {
    return (
        <header className="d-flex flex-column p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <nav className="navbar navbar-light bg-light justify-content-between">
                {!props.user.firstName?<a className="navbar-brand">Active Mind</a>:<a className="navbar-brand">{props.user.firstName} {props.user.secondName}</a>}
                <span className="navbar-text ">
                  <span className="mr-2">
                   <Link to ="/"> Main page</Link>
                  </span>
                    <span className="mr-2">
                        {props.loggedIn&&<Link to ="/" onClick={props.logOut}> Log Out</Link>}
                        {(!props.loggedIn)&&<Link to ="/login"> Log In</Link>}
                    </span>
                </span>
            </nav>
        </header>
    )
}
export default NavBar;