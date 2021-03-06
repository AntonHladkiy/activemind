import React, {useState,useEffect} from "react";

const DeveloperPage = props => {
    const [currentActivity, setCurrentActivity] = useState(props.initialActivity);
    const [page,setPage]= useState(1)
    const [date,setDate]=useState(new Date().toISOString().slice(0, 10))
    const [editing,setEditing]=useState(false)
    useEffect(()=>{
            if(page===1){
                props.loadActivities(props.token,currentActivity,date,page)
            } else{
                setPage(1)
            }
        },[date]
    )
    useEffect(()=>{
            props.loadActivities(props.token,currentActivity,date,page)
        },[page]
    )
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
    const nextPage=()=>{
        setPage(page+1)
    };
    const previousPage=()=>{
        if(page>1){
            setPage(page-1)
        }
    };
    return (
        <div className={"container dashboard"}>
            <div className={"form-group"}>
                <input type="date" onChange={handleChange} name={"date"} value={currentActivity.date} className="form-control-inline mr-2 input date-input" />
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
                <input className="form-control-inline input" type="number" name="hours" value={currentActivity.hours} onChange={handleChange} placeholder={"hours"}/>
                {!editing?
                    <button className="btn btn-success  ml-2 mb-1" onClick={()=> {
                        if (!currentActivity.project || !currentActivity.category|| !currentActivity.hours) {
                            setCurrentActivity(props.initialActivity)
                            return;
                        }
                        currentActivity.name=props.user.firstName
                        props.saveActivity(currentActivity,date,page)

                        }}>Save
                    </button>
                    :
                    <button className="btn btn-success  ml-2 mb-1" onClick={()=> {
                        setEditing(false)
                        if (!currentActivity.project || !currentActivity.category|| !currentActivity.hours) {
                            setCurrentActivity(props.initialActivity)
                            return;
                        }
                        props.updateActivity(currentActivity,date,page)
                        setCurrentActivity(props.initialActivity)
                        }}>Edit
                    </button>}
                <button className="btn btn-outline-danger ml-2 mb-1" onClick={()=> {setCurrentActivity(props.initialActivity); setEditing(false)}}>x</button>

            </div>

            <div className={"form-group"}>
                <button onClick={previousDay} className={"btn"}>{"<"}</button>
                <input type="date" onChange={handleDateChange} className="form-control-inline w-25 date" value={date}/>
                <button onClick={nextDay} className={"btn"}>{">"}</button>
            </div>
            <div >
                <table className={"table "}>
                        <thead>
                        <tr>
                            <th scope="col">Project</th>
                            <th scope="col">Category</th>
                            <th scope="col">Hours</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                    <tbody >
                    {props.activities.map((activity) => (
                        <tr key={activity.id+"ac"}>
                            <td>{activity.project}</td>
                            <td>{activity.category}</td>
                            <td>{activity.hours}</td>
                            <td>
                                <button className={" btn btn-outline-dark mr-2"} onClick={()=>{setCurrentActivity(activity); setEditing(true)}}>
                                    Edit
                                </button>
                                <button  className={"btn btn-outline-dark mr-2"} onClick={()=>{
                                    if(editing){
                                        setEditing(false)
                                        setCurrentActivity(props.initialActivity)
                                    }
                                    props.removeActivity(activity.id,props.initialActivity,page)}}>
                                    Delete
                                </button>
                            </td
                        ></tr>
                    ))}
                    </tbody>
                    <thead>
                    <tr>
                        <th className={"total"} colSpan={"3"}>Total: {totalHours()}</th>
                        <th className={"total"} scope="col">
                            <button onClick={previousPage} className={"btn"}>{"<"}</button>
                            Page: {page}
                            <button onClick={nextPage} className={"btn"}>{">"}</button>
                        </th>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
}

export default DeveloperPage;