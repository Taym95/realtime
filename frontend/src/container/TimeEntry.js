import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import moment from 'moment';
import InputText from '../component/InputText';
import InputTime, { InputTimeButton } from '../component/InputTime';
import SmartDuration from '../component/SmartDuration';
import InputSelect from '../component/InputSelect';
import { TimeEntryForm, TimeEntryFormField } from '../component/TimeEntryForm';
import { ProjectStore } from '../store/Project';
import { Entry } from '../store/Entry';
import View from '../store/View';
import Icon from 'component/Icon';
import IconAdd from 'image/icon-add.svg';
import IconRecord from 'image/icon-record.svg';
import IconStop from 'image/icon-stop.svg';

@observer
export default class TimeEntry extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        viewStore: PropTypes.instanceOf(View).isRequired,
        clearEntry: PropTypes.bool,
    };

    @action handleInput = (key, value) => {
        const { entry } = this.props;
        entry._editing = true;

        switch (key) {
            case 'description':
                entry.description = value;
                break;
            case 'project':
                entry.project = isNaN(value) ? null : parseInt(value);
                break;
            case 'startedAt':
                entry.startedAt = value;
                break;
            case 'endedAt':
                entry.endedAt = value;
                break;
            default:
                break;
        }
    };

    @action handleSubmit = () => {
        const { entry, viewStore } = this.props;
        const now = moment();
        // If the entry already existed, we just want to set the end time.
        if (entry.id && !entry.endedAt) {
            entry._editing = true;
            entry.endedAt = now;
        }
        if (!entry.startedAt) {
            entry.startedAt = now;
        }
        let msg = '';
        if (entry.startedAt.isAfter(now)) {
            msg = 'From time cannot be in the future';
        }
        if (entry.endedAt) {
            if (entry.endedAt.isAfter(now)) {
                msg = 'Until time cannot be in the future';
            }
            if (entry.endedAt.isBefore(entry.startedAt)) {
                msg = 'Until time cannot be before from time';
            }
            if (entry.endedAt.diff(entry.startedAt, 'hours') > 24) {
                msg =
                    'It is not humanly possible to work for more than 24 hours';
            }
        }
        if (msg === '') {
            entry.user = this.props.viewStore.currentUser.id;
            entry.save();
            entry._editing = false;
            if (this.props.clearEntry) {
                entry.clear();
            }
        } else {
            viewStore.addNotification({
                message: msg,
                key: 'entryFail',
                dismissAfter: 4000,
            });
        }
    };

    formatProjectToOption(project) {
        return {
            value: String(project.id),
            name: project.name,
        };
    }

    renderButton() {
        const { entry } = this.props;

        let icon = IconAdd;
        if (!entry.endedAt) {
            if (entry.id) {
                icon = IconStop;
            } else {
                icon = IconRecord;
            }
        }

        return (
            <TimeEntryFormField>
                <Icon icon={icon} />
            </TimeEntryFormField>
        );
    }

    render() {
        const { entry } = this.props;

        return (
            <TimeEntryForm onSubmit={this.handleSubmit}>
                <TimeEntryFormField label="Project" size="1">
                    <InputSelect
                        name="project"
                        placeholder="Choose project"
                        options={this.props.projectStore.map(
                            this.formatProjectToOption
                        )}
                        onChange={this.handleInput}
                        value={entry.project ? String(entry.project) : ''}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Description" size="2">
                    <InputText
                        name="description"
                        onChange={this.handleInput}
                        value={entry.description}
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="From" size="1">
                    <InputTime
                        name="startedAt"
                        onChange={this.handleInput}
                        value={entry.startedAt}
                        disableClear
                    />
                </TimeEntryFormField>
                <TimeEntryFormField label="Duration" size="1">
                    <InputTimeButton disabled>
                        {entry.startedAt
                            ? <SmartDuration
                                  startedAt={entry.startedAt || moment()}
                                  endedAt={entry.endedAt}
                              />
                            : '—'}
                    </InputTimeButton>
                </TimeEntryFormField>
                <TimeEntryFormField label="Until" size="1">
                    <InputTime
                        name="endedAt"
                        onChange={this.handleInput}
                        value={entry.endedAt}
                        disableNow
                        showDash={entry.isNew}
                    />
                </TimeEntryFormField>
                {this.renderButton()}
            </TimeEntryForm>
        );
    }
}
