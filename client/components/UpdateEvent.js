import React from 'react'
import {Modal, Form, Button} from 'react-bootstrap'
import axios from 'axios'
import {deleteEvent, updateEvent} from '../store/events'
import {connect} from 'react-redux'

class UpdateEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      date: '',
      time: ''
    }

    // this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleImageInput = this.handleImageInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({
      id: this.props.event.id,
      name: this.props.event.name,
      description: this.props.event.description,
      // date: new Date(this.props.event.eventDate).toLocaleDateString(),
      // time: new Date(this.props.event.eventDate).toLocaleTimeString(),
      imageUrl: this.props.event.imageUrl
    })
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleImageInput = this.handleImageInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async handleImageInput(event) {
    let imageFormObj = new FormData()
    imageFormObj.append('imageData', event.target.files[0])
    const {data} = await axios.post('/api/image/upload', imageFormObj)

    this.setState({imageUrl: data})
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.updateEvent(
      {
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        // eventDate: this.state.date + ' ' + this.state.time + ':00',
        imageUrl: this.state.imageUrl
        // organizerId: this.props.event.organizerId,
      },

      this.props.user.id
    )
    this.props.handleClose(false)
  }

  handleDelete() {
    console.log(this.props.event.id)
    this.props.deleteEvent(this.props.event.id, this.props.user.id)
    this.props.handleClose(false)
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Your Event</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              name="name"
              type="name"
              style={{marginLeft: '100px'}}
              value={this.state.name}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Event Description</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              name="description"
              type="description"
              style={{marginLeft: '100px'}}
              value={this.state.description}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              name="date"
              type="date"
              value={this.state.date}
              onChange={this.handleChange}
              style={{marginLeft: '100px'}}
            />
          </Form.Group>
          <Form.Group controlId="time">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              name="time"
              type="time"
              value={this.state.time}
              onChange={this.handleChange}
              style={{marginLeft: '100px'}}
            />
          </Form.Group>
          <Form.Group controlId="imageUrl">
            <Form.Label>Event Image</Form.Label>
            <br />
            <Form.File
              id="imageUpload"
              name="imageUrl"
              className="m-0 mb-1"
              onChange={this.handleImageInput}
            />
            <br />{' '}
          </Form.Group>
          <div className="d-flex justify-content-end">
            {this.state.name &&
            this.state.description &&
            this.state.imageUrl ? (
              // &&
              // this.state.date &&
              // this.state.time
              <Button
                variant="success"
                active
                type="submit"
                // style={{
                //   marginLeft: '400px',
                //   marginBottom: '30px'
                // }}
                className="m-1"
              >
                Update
              </Button>
            ) : (
              <Button variant="success" disabled type="submit" className="m-1">
                Update
              </Button>
            )}

            <Button
              variant="danger"
              onClick={this.handleDelete}
              className="m-1"
            >
              Delete
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

const mapDispatch = dispatch => ({
  updateEvent: (updatedEvent, eventId) =>
    dispatch(updateEvent(updatedEvent, eventId)),
  deleteEvent: (eventId, userId) => dispatch(deleteEvent(eventId, userId))
})

export default connect(null, mapDispatch)(UpdateEvent)