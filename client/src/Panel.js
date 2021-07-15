import React from 'react'
import { Card, CardGroup } from 'react-bootstrap'

export default function panel(props) {
    
  if (!props) return

    const content = props.props
    
    return (
      <CardGroup>
      {content.map(cont =>
        <Card key={cont.key}>
          <Card.Img variant="top" src={cont.imgUrl} />
           <Card.Title>{cont.name}</Card.Title>
        </Card>
      )}
      </CardGroup> )
}
