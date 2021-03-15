import React from 'react';
import { shallow} from 'enzyme';
import AdminPage from '../components/AdminPage';
let initialUser={
    email:'',
    password:''
}
let currentActivity={
    name:""
}
describe('AdminPage', () => {
    let wrapped = shallow(<AdminPage initialUser={initialUser} initialActivity={currentActivity} projects={[]} categories={[]} activities={[]} users={[]}/>);
    it('should render the AdminPage Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});