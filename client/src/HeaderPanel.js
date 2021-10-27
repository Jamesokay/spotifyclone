import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'


export default function HeaderPanel({ content, creators }) {


    const [titleStyle, setTitleStyle] = useState({})
    const { setCurrentTheme } = useContext(ThemeContext)
    const user = useContext(UserContext)
    const [isOwner, setIsOwner] = useState(false)
    
    useEffect(() => {
      if (!content.title) return

      if (content.title.length <= 20) {
        setTitleStyle({fontSize: '70pt', whiteSpace: 'nowrap'})
      }
      else if (content.title.length > 20 && content.title.length < 25) {
        setTitleStyle({fontSize: '50pt', whiteSpace: 'nowrap'})
      }
      else if (content.title.length > 25) {
        setTitleStyle({fontSize: '35pt'})
      }
    }, [content.title])


    

    const [gradient, setGradient] = useState('linear-gradient(grey, #121212)')

    useEffect(() => {
      if (!creators[0]) return
      if (!user) return

      if (creators[0].id === user.id) {
        setIsOwner(true)
      }
    }, [creators, user])
    
    function getData() {
      var canvas = document.createElement('canvas');
      var ctx    = canvas.getContext('2d');
  
      var myImgElement = document.getElementById('headerImage');
      myImgElement.crossOrigin = ''
      
      canvas.height = myImgElement.naturalHeight
      canvas.width = myImgElement.naturalWidth
      ctx.drawImage( myImgElement, 0, 0 );

      var xStart = Math.floor(canvas.width * 0.2)
      var yStart = Math.floor(canvas.height * 0.6)
  

      var imgdata = ctx.getImageData(xStart,yStart,40,40);
      var pixels = imgdata.data;

      var red = 0
      var green = 0
      var blue = 0
      var alpha = 0

      for (let i = 0; i < pixels.length; i += 4) {
        
        red += pixels[i]
        green += pixels[i + 1]
        blue += pixels[i + 2]
        alpha += pixels[i + 3]
        
      }

    //  console.log('red: ' + red + ' green: ' + green + ' blue: ' + blue + ' alpha: ' + alpha) 

      let avgRed = Math.floor(red / (pixels.length / 4))
      let avgGreen = Math.floor(green / (pixels.length / 4))
      let avgBlue = Math.floor(blue / (pixels.length / 4))
      let avgAlpha = Math.floor(alpha / (pixels.length / 4))

    //  console.log('AVG red: ' + avgRed + ' AVG green: ' + avgGreen + ' AVG blue: ' + avgBlue + ' AVG alpha: ' + avgAlpha) 

      let bg = 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ',' + avgAlpha + ')'
      setGradient('linear-gradient(' + bg + ', #121212)')
      setCurrentTheme('' + avgRed + ', ' + avgGreen + ', ' + avgBlue)
      
      
    }



    return (
        <div className='headerPanel' style={{backgroundImage: gradient, transition: 'background 0.3s ease-in-out'}}>
        <div className='headerBody'>
          <img id='headerImage' src={content.imgUrl} alt='' 
                onLoad={()=> getData()}
                />
          {(isOwner)?
          <div id='headerImageChange'>
            <span>Choose photo</span>
          </div>
          :
          <div></div>
          }
            <div className='headerInfo'>
              <span className='headerType'>{content.type}</span>
              <span style={titleStyle} className='headerTitle'>{content.title}</span>
              
              <span>
              {creators.map((creator, index, creators) =>
               <span key={creator.id}>
                <span className='headerCreator'>{creator.name}</span>
                {(index < creators.length - 1)?
                        <span style={{color: 'white'}}> • </span>
                        :
                        <span></span>
                        }
                  </span>
                )}  
                <span className='headerSub'>{content.info}</span>
              </span>

              
            </div>
          </div>
        </div>
    )
}
