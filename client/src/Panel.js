import React from 'react'
import { Container, Card, CardGroup } from 'react-bootstrap'

export default function panel(props) {
     
    return (
      <Container>
      <h3>{props.name}</h3>
      <CardGroup>
      {props.content.map(cont =>
        <Card key={cont.key}>
          <Card.Img variant="top" src={cont.imgUrl} />
           <Card.Title>{cont.name}</Card.Title>
        </Card>
      )}
      </CardGroup>
      </Container> )
}
