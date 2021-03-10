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
        name:'',
        project:'',
        category:'',
        hours:'',
        date:new Date().toISOString().slice(0, 10)
    }
    const initialUser={
        token:'',
        role:'',
        firstName:'',
        secondName:''
    }
    const qs = require('qs');
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
                loadActivities(user.token)
                loadCategories(user.token)
                loadProjects(user.token)
                if(user.role==="admin"){
                    loadUsers(user.token)
                }
                setLoggedIn(true)
            }
        }}},[]
    )
    const loadActivities=(token)=>{
        axios.get('http://localhost:3001/api/v1/activities',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setActivities(res.data)
            })
    }

    const loadCategories=(token)=>{
        axios.get('http://localhost:3001/api/v1/categories',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setCategories(res.data)
            })
    }
    const loadUsers=(token)=>{
        axios.get('http://localhost:3001/api/v1/users',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                console.log(res)
                setUsers(res.data)
            })
    }
    const loadProjects=(token)=>{
        axios.get('http://localhost:3001/api/v1/projects',{
            headers: {
                Authorization:token //the token is a variable which holds the token
            }})
            .then(res => {
                setProjects(res.data)
            })
    }

    const logIn=(user)=>{

        axios.post('http://localhost:3001/api/v1/auth',{
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
                            secondName:res.data.user.secondName
                        })
                        sessionStorage.setItem('user',qs.stringify({
                            token:res.data.token,
                            role:res.data.user.role,
                            firstName:res.data.user.firstName,
                            secondName:res.data.user.secondName
                        }))
                        setLoggedIn(true)
                        loadActivities(res.data.token)
                        loadCategories(res.data.token)
                        loadProjects(res.data.token)
                        if(res.data.role==="admin"){
                            loadUsers(res.data.token)
                        }
                    }
                }
            ).catch(error=>console.log(error))
    }
    const logOut=()=>{
        setUser(initialUser)
        setLoggedIn(false)
        sessionStorage.removeItem('user')
    }
    const saveActivity = activity => {
        const qs = require('qs');
        axios.post('http://localhost:3001/api/v1/activities', qs.stringify(
            {
                activity:{
                    name: activity.name,
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
            .then(res=>( setActivities(activities=>[...activities, {
                id:res.data.id,
                name: activity.name,
                project: activity.project,
                category: activity.category,
                hours: activity.hours,
                date: activity.date
            }])))
            .catch( error => {
                alert("Wrong form format try again");
                console.log(error)
            })
    };
    const updateActivity = (updatedActivity) => {
        const qs = require('qs');
        axios.patch ( 'http://localhost:3001/api/v1/activities/' + updatedActivity.id, qs.stringify (
            {
                activity: {
                    name: updatedActivity.name,
                    project: updatedActivity.project,
                    category: updatedActivity.category,
                    hours: updatedActivity.hours,
                    date: updatedActivity.date
                }
            }),{
            headers: {
                Authorization: user.token,
                Content_Type: "application/json"
            }}).then ( (res) =>{
                setActivities(activities=>activities.map(activity => (activity.id === updatedActivity.id ? {
                    id:updatedActivity.id,
                    name: updatedActivity.name,
                    project: updatedActivity.project,
                    category: updatedActivity.category,
                    hours: updatedActivity.hours,
                    date: updatedActivity.date
                } : activity)))})
            .catch(()=>{
                alert("Wrong form format try again");
            })
    };
    const removeActivity = id => {
        axios.delete( 'http://localhost:3001/api/v1/activities/' + id,{
            headers:{
                Authorization:user.token,
                Content_Type:"application/json"
            }})
            .then(() => {
                setActivities(activities=>activities.filter(activity => activity.id !== id))
            })
            .catch(error => console.log(error))
    };

    return (
        <Router>
            <div><NavBar user={user} loggedIn={loggedIn} logOut={logOut}/></div>
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
                                       removeActivity={removeActivity} updateActivity={updateActivity} users={users}/>
                        </div>
                    }
                    {(user.role==="developer") &&
                        <div>
                            <DeveloperPage user={user} categories={categories} projects={projects}
                                           initialActivity={initialActivity} saveActivity={saveActivity} activities={activities}
                                           removeActivity={removeActivity} updateActivity={updateActivity}
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