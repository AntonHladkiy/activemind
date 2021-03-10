import React, {useState} from "react";

const DeveloperPage = props => {
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
           total=total+activity.hours
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
        <div>
            <div>
                <select onChange={handleChange} name={"project"} value={currentActivity.project}>
                    {props.projects.map((project) => (
                        <option key={project.id+"pr"} value={project.name} >{project.name}</option>
                    ))}
                    <option disabled hidden key={"pr"} value={""}>{"Project"}</option>
                </select>
                <select onChange={handleChange} name={"category"} value={currentActivity.category}>
                    {props.categories.map((category) => (
                        <option key={category.id+"ct"} value={category.name}>{category.name}</option>
                    ))}
                    <option disabled hidden key={"ct"} value={""}>{"Category"}</option>
                </select>
                <input className= "w-25" type="number" name="hours" value={currentActivity.hours} onChange={handleChange} placeholder={"hours"}/>
                {!editing?
                    <button className="btn btn-success mt-2 mr-2" onClick={()=> {
                        if (!currentActivity.project || !currentActivity.category|| !currentActivity.hours) return;
                        currentActivity.name=props.user.firstName
                        props.saveActivity(currentActivity)
                        }}>Save
                    </button>
                    :
                    <button className="btn btn-success mt-2 mr-2" onClick={()=> {
                        setEditing(false)
                        if (!currentActivity.project || !currentActivity.category|| !currentActivity.hours) {
                            setCurrentActivity(props.initialActivity)
                            return;
                        }
                        props.updateActivity(currentActivity)
                        setCurrentActivity(props.initialActivity)
                        }}>Edit
                    </button>}

            </div>
            <div>
                <button onClick={previousDay}>{"\<"}</button>
                <input type="date" onChange={handleDateChange} value={date}/>
                <button onClick={nextDay}>{"\>"}</button>
            </div>
            <div>
                <table className={"table"}>
                        <thead>
                        <tr>
                            <th scope="col">Project</th>
                            <th scope="col">Category</th>
                            <th scope="col">Hours</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                    <tbody>
                    {props.activities.filter(activity=>activity.date===date).map((activity) => (
                        <tr key={activity.id+"ac"}>
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
                        ></tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                Total: {totalHours()}
            </div>
        </div>
    );
}

export default DeveloperPage;