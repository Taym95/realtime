import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    background: #fff;
    border-radius: 8px;
    border: 0;
    height: 40px;
    padding: 0 16px;
`;

const Button = props => (
    <StyledButton type="button" {...props}>
        {props.children}
    </StyledButton>
);

Button.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
