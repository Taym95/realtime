import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import EntryOverview from '../container/EntryOverview';
import View from '../store/View';
import Title from '../component/Title';
import { ProjectStore } from '../store/Project';
import { UserStore } from '../store/User';
import { EntryStore } from '../store/Entry';

@observer
export default class ProjectEntriesScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
        match: PropTypes.object.isRequired,
    };

    componentWillMount() {
        this.projectStore = new ProjectStore();
        this.userStore = new UserStore();
        this.entryStore = new EntryStore();
    }

    componentDidMount() {
        this.subscribe();
        this.props.viewStore.socket.on('open', this.subscribe);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    subscribe = () => {
        this.projectStore.clear();
        this.projectStore.subscribe();
        this.userStore.clear();
        this.userStore.subscribe();
        this.entryStore.clear();
        this.entryStore.subscribe({
            project: parseInt(this.props.match.params.id),
        });
    };

    unsubscribe = () => {
        this.projectStore.unsubscribe();
        this.userStore.unsubscribe();
        this.entryStore.unsubscribe();
    };

    render() {
        const projectId = this.props.match.params.id;
        const project = this.projectStore.get(projectId);
        return (
            <div>
                <Title>Project {project ? project.name : 'Unknown'}</Title>
                <EntryOverview
                    entries={this.entryStore}
                    projectStore={this.projectStore}
                    userStore={this.userStore}
                />
            </div>
        );
    }
}
