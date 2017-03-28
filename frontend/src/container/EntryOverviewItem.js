import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemDescription,
    EntryItemProject,
    EntryItemHours,
    EntryItemActions,
} from '../component/EntryList';
import Button from '../component/Button';

function formatDiffMinutes(minutes) {
    return (minutes / 60).toFixed(2);
}

@observer
export default class EntryOverviewItem extends Component {
    static propTypes = {
        entry: PropTypes.object.isRequired,
    };

    handleDelete = () => {
        this.props.entry.delete();
    };

    render() {
        const { entry } = this.props;
        const diffMinutes = entry.differenceInMinutes;
        return (
            <EntryItem key={entry.id}>
                <EntryItemProject>
                    {entry.project.id ? entry.project.title : '[Missing]'}
                </EntryItemProject>
                <EntryItemDescription>{entry.description}</EntryItemDescription>
                <EntryItemHours>
                    {entry.startedAt.format('HH:mm')}{' - '}
                    {entry.endedAt ? entry.endedAt.format('HH:mm') : 'Running'}
                    {diffMinutes ? ` (${formatDiffMinutes(diffMinutes)}h)` : null}
                </EntryItemHours>
                <EntryItemActions>
                    <Button onClick={this.handleDelete}>×</Button>
                </EntryItemActions>
            </EntryItem>
        );
    }
}
