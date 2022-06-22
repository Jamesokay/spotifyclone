import Panel from '../components/Panel'
import PanelGrid from '../components/PanelGrid'
import Loader from './Loader'
import { useContext } from 'react'
import { DashContext } from '../DashContext'

export default function Dashboard() {
    const date = new Date()
    const time = date.toLocaleTimeString('en-GB')
    const timeMod = parseInt(time.replace(/:/g, ''))
    const greeting = greetingMessage(timeMod)
    const {recent, recentReversed, forToday, moreLike, moreLikeSeed, recommend, loading} = useContext(DashContext)

    // Set greeting message based on time of day
    function greetingMessage(time) {
      if (time < 120000) { return 'Good morning' }
      else if (time >= 120000 && time < 175959) { return 'Good afternoon' }
      else if (time >= 180000) { return 'Good evening' }
    }
    
    return loading? <Loader /> : (
      <div id='dash'>
        {recent.length > 7?
          <PanelGrid head={greeting}/>
          :
          <Panel content={recent} title={greeting} />  
        }
        <Panel content={moreLike} title={`More like ${moreLikeSeed}`} />
        <Panel content={recommend} title='Album picks' subtitle='Albums for you based on what you like to listen to' />   
        <Panel content={recentReversed} title='Jump back in'/>
        <Panel content={forToday} title='Recommended for today' />
      </div>
    )
}        