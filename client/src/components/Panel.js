import { useState, useEffect } from 'react'
import useViewport from '../hooks/useViewPort'
import LikedSongsCard from './LikedSongsCard'
import { useSelector } from 'react-redux'
import Card from './Card'

export default function Panel({ title, subtitle, content, type, likedSongsCard }) {
    const [index, setIndex] = useState(5)
    const [cardWidth, setCardWidth] = useState('17.8%')
    const { width } = useViewport() 
    const sidebarWidth = useSelector(state => state.page.sidebarWidth)
    const breakPointExtraLarge = 1600
    const breakPointLarge = 1060
    const breakPointMedium = 860
    const breakPointSmall = 620
    const [array, setArray] = useState([])

    useEffect(() => {
        if ((width - sidebarWidth) <= breakPointSmall) {
          setIndex(2)
          setCardWidth('44.5%')
        }
        else if ((width - sidebarWidth) > breakPointSmall && (width - sidebarWidth) <= breakPointMedium) {
          setIndex(3)
          setCardWidth('29.6%')
        }
        else if ((width - sidebarWidth) > breakPointMedium && (width - sidebarWidth) < breakPointLarge) {
          setIndex(4)
          setCardWidth('22.25%')
        }
        else if ((width - sidebarWidth) > breakPointLarge && (width - sidebarWidth) < breakPointExtraLarge) {
          setIndex(5)
          setCardWidth('17.8%')
        }
        else if ((width - sidebarWidth) >= breakPointExtraLarge) {
          setIndex(10)
          setCardWidth('8.9%')
        }
        return function cleanUp() {
            setIndex(5)
            setCardWidth('17.8%')
        }
    }, [width, sidebarWidth])

    useEffect(() => {
      if (type === 'collection') { setArray(content) }
      else { setArray(content.slice(0, index)) }
      return function cleanUp() { setArray([]) }
    }, [type, content, index])
  
    return (
      <>
        <span className={type === 'collection'? 'collectionTitle' : 'panelTitle'}>{title}</span>
        {subtitle && (
          <span className='panelTitleSub'>{subtitle}</span>
        )}
        <div className='panel' style={type === 'collection'? {flexWrap: 'wrap'} : {}}> 
        {likedSongsCard && ( <LikedSongsCard /> )}
        {array.map(cont =>
          <Card key={cont.key} item={cont} cardWidth={cardWidth} />
        )}
        </div>
      </>)
}
