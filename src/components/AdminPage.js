import React, {useState} from "react";
import {Link} from "react-router-dom";

const AdminPage = props => {
    const [currentActivity, setCurrentActivity] = useState(props.initialActivity);
    const [date,setDate]=useState(new Date().toISOString().slice(0, 10))
    const [editing,setEditing]=useState(false)
    const handleChange = event => {
        const { name, value } = event.target
        setCurrentActivity({ ...currentActivity, [name]: value })
    };
    const handleDateChange = event => {
        const { value } = event.target
        setDate(value)
    };
    const totalHours=()=>{
        let total=0;
        props.activities.filter(activity=>activity.date===date).map((activity) => (
            total=total+parseInt(activity.hours)
        ))
        return total;
    };
    const nextDay=()=>{
        const nextDay=new Date(date)
        nextDay.setDate(nextDay.getDate()+1)
        setDate(nextDay.toISOString().slice(0, 10))
    };
    const previousDay=()=>{
        const previousDay=new Date(date)
        previousDay.setDate(previousDay.getDate()-1)
        setDate(previousDay.toISOString().slice(0, 10))
    };
    return (
        <div className={"container"}>
            <div className={"form-group"}>
                {editing?
                    <input type="date" onChange={handleChange} name={"date"} value={currentActivity.date} className="form-control-inline w-25 date" />
                    :
                    "Filters:"}
                <select className="mr-2 select" onChange={handleChange} name={"name"} value={currentActivity.name}>
                    {props.users.map((user) => (
                        <option key={user.id} value={user.firstName} >{user.firstName+" "+user.secondName}</option>
                    ))}
                    <option disabled hidden key={"n"} value={""}>{"User"}</option>
                </select>
                <select className="mr-2 select" onChange={handleChange} name={"project"} value={currentActivity.project}>
                    {props.projects.map((project) => (
                        <option key={project.id+"pr"} value={project.name} >{project.name}</option>
                    ))}
                    <option disabled hidden key={"pr"} value={""}>{"Project"}</option>
                </select>
                <select className="mr-2 select" onChange={handleChange} name={"category"} value={currentActivity.category}>
                    {props.categories.map((category) => (
                        <option key={category.id+"ct"} value={category.name}>{category.name}</option>
                    ))}
                    <option disabled hidden key={"ct"} value={""}>{"Category"}</option>
                </select>
                {editing&&
                    <span>
                    <input className="form-control-inline input" type="number" name="hours" value={currentActivity.hours} onChange={handleChange} placeholder={"hours"}/>
                    <button className="btn btn-success mt-2 mr-2 mb-1" onClick={()=> {
                        setEditing(false)
                        if (!currentActivity.project || !currentActivity.category|| !currentActivity.hours) {
                            setCurrentActivity(props.initialActivity)
                            return;
                        }
                        props.updateActivity(currentActivity)
                        setCurrentActivity(props.initialActivity)
                    }}>Edit
                    </button></span>}

            </div>
            <div>
                <button onClick={previousDay} className={"btn"}>{"<"}</button>
                <input type="date" onChange={handleDateChange} value={date} className="form-control-inline w-25 date" />
                <button onClick={nextDay} className={"btn"} >{">"}</button>
            </div>
            <div>
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Project</th>
                        <th scope="col">Category</th>
                        <th scope="col">Hours</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!editing?props.activities.filter(activity=>activity.date===date)
                        .filter(activity=>activity.project.includes(currentActivity.project))
                        .filter(activity=>activity.category.includes(currentActivity.category))
                        .filter(activity=>activity.name.includes(currentActivity.name)).map((activity) => (
                            <tr key={activity.id+"ac"}>
                                <td>{activity.name}</td>
                                <td>{activity.project}</td>
                                <td>{activity.category}</td>
                                <td>{activity.hours}</td>
                                <td>
                                    <button onClick={()=>{setCurrentActivity(activity); setEditing(true)}}>
                                        Edit
                                    </button>
                                    <button onClick={()=>{props.removeActivity(activity.id)}}>
                                        Delete
                                    </button>
                                </td
                                ></tr>))
                        :props.activities.filter(activity=>activity.date===date).map((activity) => (
                        <tr key={activity.id+"ac"}>
                            <td>{activity.name}</td>
                            <td>{activity.project}</td>
                            <td>{activity.category}</td>
                            <td>{activity.hours}</td>
                            <td>
                                <button className={"btn btn-outline-dark mr-2"} onClick={()=>{setCurrentActivity(activity); setEditing(true)}}>
                                    Edit
                                </button>
                                <button className={"btn btn-outline-dark mr-2"} onClick={()=>{props.removeActivity(activity.id)}}>
                                    Delete
                                </button>
                            </td
                            ></tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <h3>
                Total: {totalHours()}
            </h3>
        </div>
    );
}

export default AdminPage;