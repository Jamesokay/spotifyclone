import Panel from '../components/Panel'
import PanelGrid from '../components/PanelGrid'
import Loader from './Loader'
import useDash from '../hooks/useDash'

export default function Dashboard() {
    const date = new Date()
    const time = date.toLocaleTimeString('en-GB')
    const timeMod = parseInt(time.replace(/:/g, ''))
    const greeting = greetingMessage(timeMod)
    const {recent, recentReversed, forToday, moreLike, moreLikeSeed, recommend, loading} = useDash()

    // Set greeting message based on time of day
    function greetingMessage(time) {
      if (time < 120000) { return 'Good morning' }
      else if (time >= 120000 && time < 175959) { return 'Good afternoon' }
      else if (time >= 180000) { return 'Good evening' }
    }
    
    return loading? <Loader /> : (
      <div id='dash'>
        {recent.length > 7?
          <PanelGrid content={recent} head={greeting}/>
          :
          <>
            <span className='panelTitle'>{greeting}</span>
            <Panel content={recent} />
          </>     
        }
        <span className='panelTitle'>{'More like ' + moreLikeSeed}</span>
        <Panel content={moreLike} />
        <span className='panelTitle'>Album picks</span>
        <span className='panelTitleSub'>Albums for you based on what you like to listen to.</span>
        <Panel content={recommend} />   
        <span className='panelTitle'>Jump back in</span> 
        <Panel content={recentReversed} />
        <span className='panelTitle'>Recommended for today</span>
        <Panel content={forToday} />
      </div>
    )
}        