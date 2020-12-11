import React, {useEffect, useRef, useState} from 'react'
import {useParams, useLocation} from 'react-router'
import {connect} from 'react-redux'
import socket from '../socket'
import Room from './Room'
import {Button} from 'react-bootstrap'

const VideoSession = props => {
  console.log('pros: ', props)
  const params = useParams()
  const location = useLocation()
  console.log('location hook: ', location)
  const userVideo = useRef()
  const partnerVideo = useRef()

  useEffect(() => {
    if (userVideo.current && props.videos.myVideo.id) {
      userVideo.current.srcObject = props.videos.myVideo
    }
    if (
      partnerVideo.current &&
      props.videos.partnersVideo &&
      props.videos.partnersVideo.id
    ) {
      partnerVideo.current.srcObject = props.videos.partnersVideo
    }
  })

  function handleClick() {
    console.log('in handleclick in videosession')
    console.log('roomId: ', params.roomId)
    socket.emit('closeSession', params.roomId)
  }
  return (
    <div>
      <Room roomId={params.roomId} />
      <h1>{location.state.name}</h1>
      <h5>{location.state.description}</h5>
      <video autoPlay playsInline muted />
      <video id="localVideo" autoPlay playsInline muted ref={userVideo} />
      <video id="remoteVideo" autoPlay playsInline muted ref={partnerVideo} />
      <Button type="button" variant="info" onClick={() => handleClick()}>
        Hang Up
      </Button>
    </div>
  )
}

const mapState = state => {
  return {
    videos: state.videos
  }
}

export default connect(mapState)(VideoSession)
