import React from 'react'
import { Container, Card } from 'react-bootstrap'

export default function panel(props) {
     
    return (
      <Container className='d-flex justify-content-space-around'>
      {props.content.map(cont =>
        <Card style={{width: '200px', margin: '10px', textAlign: 'center'}} key={cont.key}>
          <Card.Img variant="top" src={cont.imgUrl} />
           <Card.Title>{cont.name}</Card.Title>
        </Card>
      )}
      </Container> )
}
