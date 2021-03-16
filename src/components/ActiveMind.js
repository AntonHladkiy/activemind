import React, {useEffect, useState} from 'react';

import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import AdminPage from './AdminPage'
import NavBar from "./NavBar";
import Login from "./Login";
import DeveloperPage from "./DeveloperPage";

function ActiveMind() {

    const initialActivity={
        id:'',
        user_id:'',
        project:'',
        category:'',
        hours:'',
        date:new Date().toISOString().slice(0, 10)
    }
    const initialUser={
        token:'',
        role:'',
        firstName:'',
        lastName:''
    }
    const qs = require('qs');
    const [loading,setLoading] = useState(false)
    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(qs.parse(sessionStorage.getItem('user')));
    const [loggedIn, setLoggedIn] = useState(false);


    useEffect(()=>{
        if(user){
        if(user.token){
            if(user.token!==''){
                setLoading(true)
                loadActivities(user.token,initialActivity,new Date().toISOString().slice(0, 10),1)
                loadCategories(user.token)
                loadProjects(user.token)
                if(user.role==="admin"){
                    loadUsers(user.token)
                }
                setLoggedIn(true)
                setLoading(false)
            }
        }}},[]
    )
    const loadActivities=(token,filters,date,page)=>{
        setLoading(true)
        axios.get('https://activemind-api.herokuapp.com/api/v1/activities',{
            params:{
                user_id:filters.user_id,
                project:filters.project,
                category:filters.category,
                date:date,
                page:page
            },
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setActivities(res.data)
                setLoading(false)
            })
    }

    const loadCategories=(token)=>{
        axios.get('https://activemind-api.herokuapp.com/api/v1/categories',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setCategories(res.data)
            })
    }
    const loadUsers=(token)=>{
        axios.get('https://activemind-api.herokuapp.com/api/v1/users',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
               // console.log("data received")
                setUsers(res.data)
            })
    }
    const loadProjects=(token)=>{
        axios.get('https://activemind-api.herokuapp.com/api/v1/projects',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setProjects(res.data)
            })
    }

    const logIn=(user)=>{
        setLoading(true)
        axios.post('https://activemind-api.herokuapp.com/api/v1/auth',{
            email:user.email,
            password:user.password
        })
            .then(res => {
                    if(res.data.errors){
                        alert(res.data.errors)
                    } else{
                        setUser({
                            token:res.data.token,
                            role:res.data.user.role,
                            firstName:res.data.user.firstName,
                            lastName:res.data.user.lastName
                        })
                        sessionStorage.setItem('user',qs.stringify({
                            token:res.data.token,
                            role:res.data.user.role,
                            firstName:res.data.user.firstName,
                            lastName:res.data.user.lastName
                        }))
                        loadActivities(res.data.token,initialActivity,new Date().toISOString().slice(0, 10),1)
                        loadCategories(res.data.token)
                        loadProjects(res.data.token)
                        if(res.data.user.role==="admin"){
                            loadUsers(res.data.token)
                        }
                        setLoggedIn(true)
                        setLoading(false)
                    }
                }
            ).catch(error=>console.log(error))
    }
    const logOut=()=>{
        setUser(initialUser)
        setLoggedIn(false)
        sessionStorage.removeItem('user')
    }
    const saveActivity = (activity,date,page) => {
        setLoading(true)
        const qs = require('qs');
        axios.post('https://activemind-api.herokuapp.com/api/v1/activities', qs.stringify(
            {
                activity:{
                    project: activity.project,
                    category: activity.category,
                    hours: activity.hours,
                    date: activity.date
                }
            }),{
            headers: {
                Authorization: user.token,
                Content_Type: "application/json"
            }})
            .then(res=>{ loadActivities(user.token,initialActivity,date,page)})
            .catch( error => {
                alert("Wrong form format try again");
                console.log(error)
            })
    };
    const updateActivity = (updatedActivity,date,page) => {
        setLoading(true)
        const qs = require('qs');
        axios.patch ( 'https://activemind-api.herokuapp.com/api/v1/activities/' + updatedActivity.id, qs.stringify (
            {
                activity: {
                    user_id:updatedActivity.user_id,
                    project: updatedActivity.project,
                    category: updatedActivity.category,
                    hours: updatedActivity.hours,
                    date: updatedActivity.date
                }
            }),{
            headers: {
                Authorization: user.token,
                Content_Type: "application/json"
            }}).then ( (res) =>{loadActivities(user.token,initialActivity,date,page)})
            .catch(()=>{
                alert("Wrong form format try again");
            })
    };
    const removeActivity = id => {
        setLoading(true)
        axios.delete( 'https://activemind-api.herokuapp.com/api/v1/activities/' + id,{
            headers:{
                Authorization:user.token,
                Content_Type:"application/json"
            }})
            .then(() => {
                setActivities(activities=>activities.filter(activity => activity.id !== id))
                setLoading(false)
            })
            .catch(error => console.log(error))
    };

    return (
        <Router>
            <div><NavBar user={user} loggedIn={loggedIn} logOut={logOut} loading={loading}/></div>
            <div  className={"ml-5"}>
            <Switch>
                <Route path='/login'>
                    <Login loggedIn={loggedIn} logIn={logIn} />
                </Route>
                <Route path='/'>
                    {(user.role==="admin") &&
                        <div>
                            <AdminPage user={user} categories={categories} projects={projects}
                                       initialActivity={initialActivity} activities={activities}
                                       removeActivity={removeActivity} updateActivity={updateActivity} users={users} loadActivities={loadActivities}
                                       token={user.token}
                            />
                        </div>
                    }
                    {(user.role==="developer") &&
                        <div>
                            <DeveloperPage user={user} categories={categories} projects={projects}
                                           initialActivity={initialActivity} saveActivity={saveActivity} activities={activities}
                                           removeActivity={removeActivity} updateActivity={updateActivity} loadActivities={loadActivities}
                                           token={user.token}
                            />
                        </div>
                    }
                </Route>
            </Switch>
            </div>
        </Router>
    );
}

export default ActiveMind;