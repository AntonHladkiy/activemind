import React from 'react';
import { shallow} from 'enzyme';
import Login from '../components/Login';
let initialUser={
    email:'',
    password:''
}
describe('Login', () => {
    let wrapped = shallow(<Login initialUser={initialUser} />);
    it('should render the Login Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});
describe('Login when already loggenIn', () => {
    let wrapped = shallow(<Login initialUser={initialUser} loggedIn={true}/>);
    it('should render the Login Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});