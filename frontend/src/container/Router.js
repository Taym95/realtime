import PropTypes from 'prop-types';
import React, { Component } from 'react';
import View from '../store/View';
import { Route, Switch } from 'react-router-dom';

import MyTime from '../screen/MyTime';
import Project from '../screen/Project';
import ProjectEntries from '../screen/ProjectEntries';
import UserEntries from '../screen/UserEntries';
import User from '../screen/User';
import NotFound from '../component/NotFound';

export default class Router extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        const { store } = this.props;
        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <MyTime viewStore={store} />}
                />
                <Route
                    path="/users"
                    render={() => <User viewStore={store} />}
                />
                <Route
                    path="/projects"
                    render={() => <Project viewStore={store} />}
                />
                <Route
                    path="/project/entries/:id"
                    render={rProps => (
                        <ProjectEntries viewStore={store} {...rProps} />
                    )}
                />
                <Route
                    path="/user/entries/:id"
                    render={rProps => (
                        <UserEntries viewStore={store} {...rProps} />
                    )}
                />
                <Route render={NotFound} viewStore={() => <NotFound />} />
            </Switch>
        );
    }
}
