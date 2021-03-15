import React from 'react';
import { shallow } from 'enzyme';
import NavBar from '../components/NavBar';
let customUser={
    firstName:"",
    lastName:"",
    role:""
}
describe('NavBar logged in', () => {
    let wrapped = shallow(<NavBar loggedIn={true} user={customUser}></NavBar>);
    it('should render the NavBar Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});
describe('NavBar not logged in', () => {
    let wrapped = shallow(<NavBar loggedIn={false} user={customUser}></NavBar>);
    it('should render the NavBar Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });

});