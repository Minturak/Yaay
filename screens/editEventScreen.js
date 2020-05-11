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
  save = (data) => {
    if (data.allEvents) {
      dbo.updateMultipleEvents(this.props.event.link, data)
    } else {
      dbo.updateOneEvent(this.props.event.id, data)
    }
    this.props.navigation.navigate('EventDetailsScreen')
  }
  render() {
    if (this.state.multiple === undefined) {
      return null
    }
    return (
      <EditEvent
        event={this.props.event}
        multiple={this.state.multiple}
        save={this.save}
      />
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  event: state.event,
});
export default connect(mapStateToProps)(EditEventScreen);
