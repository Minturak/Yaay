import React, { Component } from 'react';
import EditEvent from '../components/edit-event'
import { connect } from 'react-redux'
import { dbo } from '../api/dbo';

class EditEventScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            multiple: undefined,
        }
    }
    componentDidMount = _ => {
        dbo.getLinkedEvents(this.props.event.link).then(events => {
            this.setState({ multiple: events.size > 1 })
        })
    }
    render() {
        if (this.state.multiple === undefined) {
            return null
        }
        return (
            <EditEvent
                user={this.props.user.user}
                event={this.props.event}
                multiple={this.state.multiple}
            />
        );
    }
}
const mapStateToProps = state => ({
    user: state.user,
    event: state.event,
});
export default connect(mapStateToProps)(EditEventScreen);
