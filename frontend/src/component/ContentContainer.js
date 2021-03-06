import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    flex: 1;
    overflow: scroll;
    background: #333;
`;

const Main = styled.main`
    margin: 0 auto;
    max-width: 1200px;
    padding: 16px;
`;

const ContentContainer = ({ children }) => (
    <Container>
        <Main>
            {children}
        </Main>
    </Container>
);

ContentContainer.propTypes = {
    children: PropTypes.node,
};

export default ContentContainer;
