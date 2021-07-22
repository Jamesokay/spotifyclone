import React from 'react'
import { Container, Card } from 'react-bootstrap'

export default function panel(props) {
     
    return (

      <Container className='d-flex justify-content-between' style={{maxWidth: '1200px'}}>
      {props.content.map(cont =>
        <Card style={{minWidth: '220px', height: '295px', marginTop: '10px', background: '#212121'}} key={cont.key}>
          <Card.Img style={{height: '190px', width: '190px', margin: '15px', objectFit: 'cover'}} src={cont.imgUrl} />
           <Card.Title style={{color: 'white', marginLeft: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '190px'}}>{cont.name}</Card.Title>
           <Card.Subtitle className="mb-2 text-muted" style={{color: 'white', marginLeft: '15px'}}>Content info</Card.Subtitle>
        </Card>
      )}
      </Container> )
}
