import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'
import { Link } from 'react-router-dom'

export default function PanelGrid({ content }) {

    const accessToken = useContext(AuthContext)

    return (
        <div className='gridPanel'>
        {content.map(cont =>
          <Link style={{textDecoration: 'none', width: '19vw'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
          <div className='gridCard'>
            <img className='gridCardImage' src={cont.imgUrl} alt='' />
            <div className='gridCardTitle'>
                <span>{cont.name}</span>
            </div>
          </div>   
          </Link> 
        )}       
        </div>
    )
}
