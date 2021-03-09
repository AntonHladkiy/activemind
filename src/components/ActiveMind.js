import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import AdminPage from './AdminPage'
const click=()=>{
    alert('123')
}
function ActiveMind() {
    return (
        <Router>
            <Switch>
                <Route path="/admin">
                    <AdminPage click={click} />
                </Route>
            </Switch>
        </Router>
    );
}

export default ActiveMind;