/*eslint-disable */
// ^^^^ TAKE OUT

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  fetchOneRecipe,
  loadingRecipe,
  updateSingleRecipe,
  deleteRecipe
} from '../store/singleRecipe.js'
import Loader from 'react-loader-spinner'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faHeart} from '@fortawesome/free-solid-svg-icons'
import {Button, Form, Modal} from 'react-bootstrap'
import NotFound from './notFound'
import channel from '../store/channel.js'
import {withRouter} from 'react-router-dom'
import EditRecipeImg from './EditRecipeImg'

class SingleRecipe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameEdit: false,
      ingredientEdit: false,
      instructionEdit: false,
      imgEdit: false,
      name: '',
      ingredients: '',
      instructions: '',
      likes: 0,
      liked: false,
      show: false
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSubmitName = this.handleSubmitName.bind(this)
    this.handleSubmitIngredients = this.handleSubmitIngredients.bind(this)
    this.handleSubmitInstructions = this.handleSubmitInstructions.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleClose() {
    this.setState({
      show: false,
      nameEdit: false,
      ingredientEdit: false,
      instructionEdit: false,
      imgEdit: false
    })
  }

  async handleClick() {
    if (!this.state.liked) {
      console.log('not liked')
      const newLikes = this.state.likes + 1
      this.setState({likes: newLikes, liked: true})
      await this.props.updateRecipe(this.props.match.params.recipeId, {
        likes: newLikes
      })
    }
  }

  handleDelete() {
    this.handleClose()
    this.props.removeRecipe(
      this.props.match.params.recipeId,
      this.props.location.state.source,
      this.props.location.state.channelId
    )
  }

  async handleSubmitName(event) {
    event.preventDefault()
    await this.props.updateRecipe(this.props.match.params.recipeId, {
      name: this.state.name
    })
    this.setState({nameEdit: false})
  }

  async handleSubmitIngredients(event) {
    event.preventDefault()
    await this.props.updateRecipe(this.props.match.params.recipeId, {
      ingredients: this.state.ingredients
    })
    this.setState({ingredientEdit: false})
  }

  async handleSubmitInstructions(event) {
    event.preventDefault()
    await this.props.updateRecipe(this.props.match.params.recipeId, {
      instructions: this.state.instructions
    })
    this.setState({instructionEdit: false})
  }

  async componentDidMount() {
    await this.props.getOneRecipe(this.props.match.params.recipeId)
    this.setState({
      name: this.props.singleRecipe.name,
      ingredients: this.props.singleRecipe.ingredients,
      instructions: this.props.singleRecipe.instructions,
      likes: this.props.singleRecipe.likes
    })
  }

  componentWillUnmount() {
    this.props.changeLoadingState()
  }

  render() {
    const {loading} = this.props
    if (loading) {
      return (
        <div>
          <Loader type="Rings" color="#00BFFF" height={80} width={80} />
        </div>
      )
    }
    return (
      <div className="d-flex flex-column justify-content-center align-items-center m-5">
        <div id="editButton">
          <img src={this.props.singleRecipe.imageUrl} id="single_recipe_img" />

          {this.props.user.id &&
          this.props.user.id === this.props.singleRecipe.ownerId ? (
            <FontAwesomeIcon
              icon={faEdit}
              className="cursor mr-3"
              style={{color: 'blue'}}
              onClick={() => {
                this.setState({imgEdit: true})
              }}
            />
          ) : null}
        </div>
        <Modal show={this.state.imgEdit} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Image</Modal.Title>
          </Modal.Header>
          <EditRecipeImg
            updateRecipe={this.props.updateRecipe}
            singleRecipe={this.props.singleRecipe}
            handleClose={this.handleClose}
          />
        </Modal>
        <div
          id="editButton"
          className="d-flex justify-content-center align-items-center"
        >
          <h5 className="headline">
            {this.props.singleRecipe.name}&nbsp;&nbsp;
          </h5>
          {this.props.user.id &&
          this.props.user.id === this.props.singleRecipe.ownerId ? (
            <FontAwesomeIcon
              icon={faEdit}
              className="cursor mr-3"
              style={{color: 'blue'}}
              onClick={() => {
                this.setState({nameEdit: true})
              }}
            />
          ) : null}
        </div>
        <Modal show={this.state.nameEdit} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Name</Modal.Title>
          </Modal.Header>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                name="name"
                type="name"
                style={{marginLeft: '100px'}}
                value={this.state.name}
                onChange={event => this.handleChange(event)}
              />
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSubmitName}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <FontAwesomeIcon
              icon={faHeart}
              className="cursor text-navbar mb-2 mr-1"
              onClick={this.handleClick}
            />
          </div>

          <p className="text-muted">{this.state.likes}</p>

          <h3 className="authorline ml-1">
            Recipe created by:{' '}
            <span className="text-navbar font-weight-bold">
              @{this.props.singleRecipe.owner.userName}
            </span>
          </h3>
        </div>

        <div>
          <div>
            <div
              id="editButton"
              className="d-flex justify-content-center align-items-center"
            >
              <h5 className="section-headline">Ingredients:&nbsp;&nbsp;</h5>
              {this.props.user.id &&
              this.props.user.id === this.props.singleRecipe.ownerId ? (
                <div className="d-flex d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="cursor mr-3"
                    style={{color: 'blue'}}
                    onClick={() => {
                      this.setState({ingredientEdit: true})
                    }}
                  />
                </div>
              ) : null}
            </div>
            <h5>
              {this.props.singleRecipe.ingredients
                .split('\n')
                .map((elm, index) => {
                  return (
                    <div id="editButton" key={index}>
                      <Form.Check aria-label="option 1" />
                      <p className="item-text">{elm}</p>
                    </div>
                  )
                })}
            </h5>
          </div>
          <Modal show={this.state.ingredientEdit} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Ingredients</Modal.Title>
            </Modal.Header>
            <Form>
              <Form.Group controlId="ingredients">
                <Form.Label>Ingredients</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="10"
                  name="ingredients"
                  type="ingredients"
                  style={{marginLeft: '100px'}}
                  value={this.state.ingredients}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleSubmitIngredients}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div>
          <div id="editButton">
            <h5 className="section-headline">Instructions:&nbsp;&nbsp;</h5>
            {this.props.user.id &&
            this.props.user.id === this.props.singleRecipe.ownerId ? (
              <FontAwesomeIcon
                icon={faEdit}
                className="cursor mr-3"
                style={{color: 'blue'}}
                onClick={() => {
                  this.setState({instructionEdit: true})
                }}
              />
            ) : null}
          </div>
          <h5>
            {this.props.singleRecipe.instructions
              .split('\n')
              .map((elm, index) => {
                return (
                  <li key={index} className="item-text">
                    {elm}
                  </li>
                )
              })}
          </h5>
        </div>
        <Modal show={this.state.instructionEdit} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Instructions</Modal.Title>
          </Modal.Header>
          <Form>
            <Form.Group controlId="instructions">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows="10"
                name="instructions"
                type="instructions"
                style={{marginLeft: '100px'}}
                value={this.state.instructions}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSubmitInstructions}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        {this.props.user.id &&
        this.props.user.id === this.props.singleRecipe.ownerId ? (
          <Button
            variant="danger"
            type="submit"
            size="sm"
            onClick={() => {
              this.setState({show: true})
            }}
          >
            Delete recipe
          </Button>
        ) : null}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title />
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to delete this recipe?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary" onClick={this.handleDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapState = state => {
  return {
    singleRecipe: state.singleRecipe.recipe,
    loading: state.singleRecipe.loading,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getOneRecipe: recipeId => dispatch(fetchOneRecipe(recipeId)),
    changeLoadingState: () => dispatch(loadingRecipe()),
    updateRecipe: (recipeId, recipe) =>
      dispatch(updateSingleRecipe(recipeId, recipe)),
    removeRecipe: (recipeId, source, channelId) =>
      dispatch(deleteRecipe(recipeId, source, channelId))
  }
}

export default withRouter(connect(mapState, mapDispatch)(SingleRecipe))
