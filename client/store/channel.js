import axios from 'axios'

// action type
const GET_CHANNELS = 'GET_CHANNELS'

const ADD_CHANNEL = 'ADD_CHANNEL'

// initial state
const defaultChannels = []

// action creator
const getChannels = channels => ({
  type: GET_CHANNELS,
  channels
})

//thunk creator
export const fetchChannels = () => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/channels`)
      dispatch(getChannels(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const createChannel = channel => {
  return async dispatch => {
    try {
      await axios.post(`/api/channels`, channel)
      dispatch(fetchChannels())
    } catch (error) {
      console.log(error)
    }
  }
}

// reducer
export default function(state = defaultChannels, action) {
  switch (action.type) {
    case GET_CHANNELS:
      return action.channels
    default:
      return state
  }
}
