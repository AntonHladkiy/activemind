import React from 'react';
import { shallow} from 'enzyme';
import DeveloperPage from '../components/DeveloperPage';
import AdminPage from "../components/AdminPage";
let initialUser={
    email:'',
    password:''
}
let currentActivity={
    name:""
}
describe('DeveloperPage', () => {
    let wrapped = shallow(<DeveloperPage initialUser={initialUser} initialActivity={currentActivity} projects={[]} categories={[]} activities={[]}/>);
    it('should render the DeveloperPage Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});