import React from 'react';
import { shallow} from 'enzyme';
import ActiveMind from '../components/ActiveMind';
describe('ActiveMind', () => {
    let wrapped = shallow(<ActiveMind />);
    it('should render the ActiveMind Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
});