import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'
import { PageContext } from './PageContext'



export default function HeaderPanel({ content, creators, creatorImg }) {


//    const [titleStyle, setTitleStyle] = useState({})
    const { setCurrentTheme } = useContext(ThemeContext)
    const { setCurrentPage } = useContext(PageContext)
    const user = useContext(UserContext)
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
      if (!content.title) return
      if (content.title === 'Liked Songs') return

      setCurrentPage({pageName: content.title,
                      pageUri: content.uri
      })

    }, [content, content.title, content.uri, setCurrentPage])
      

    const [gradient, setGradient] = useState('linear-gradient(grey, #121212)')

    useEffect(() => {
      if (!content.title) return
      if (!creators[0]) return
      if (!user) return

      if (creators[0].id === user.id && content.title !== 'Liked Songs') {
        setIsOwner(true)
      }

      return function cleanUp() {
        setIsOwner(false)
      }

    }, [creators, content.title, user])


    
    function getData() {
      var canvas = document.createElement('canvas');
      var ctx    = canvas.getContext('2d');
  
      var myImgElement = document.getElementById('headerImage');
      myImgElement.crossOrigin = ''
      
      canvas.height = myImgElement.naturalHeight
      canvas.width = myImgElement.naturalWidth
      ctx.drawImage( myImgElement, 0, 0 );

     
      var yStart = Math.floor(canvas.height * 0.5)
  

      var imgdata = ctx.getImageData(0,yStart,50,50);
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
      setGradient('linear-gradient(' + bg + ', rgb(18, 18, 18))')
      setCurrentTheme('' + avgRed + ', ' + avgGreen + ', ' + avgBlue)
      setLoading(false)
      
      
    }



    return (
        <div id='headerPanel' style={(loading)? {visibility: 'hidden'} : {visibility: 'visible', backgroundImage: gradient}}>
        <div className='headerBody'>
          <img id='headerImage' src={content.imgUrl} alt='' onLoad={()=> getData()}/>
          {(isOwner)?
          <div id='headerImageChange'>
          <svg className='editPlaylistImage'
           width="50" 
           fill="none" 
           height="50" 
           viewBox="0 0 50 50" 
           stroke="white" 
           strokeWidth="2"
           strokeLinejoin="miter" 
            
           >
            <path className='pencilIcon' d="M12 37, L40 9, L47 16, L19 44, L7 49, L12 37, L19 44"></path>
                
        </svg>
            <span style={{marginTop: '10px'}}>Choose photo</span>
          </div>
          :
          <div></div>
          }
            <div className='headerInfo'>
              <span className='headerType'>{content.type}</span>
              <span className='headerTitle'>{content.title}</span>
              {(content.type === 'PLAYLIST')?
              <span className='headerSub'>{content.about}</span>
              :
              <></>
              }
              <div className='headerCreatorInfo'>
              {(creatorImg && creators.length === 1)?
              <img className='artistImgSmall' src={creatorImg} alt=''/>
              :
              <></>
              }
              {creators.map((creator, index, creators) =>
               <span key={creator.id}>
                <span className='headerCreator'>{creator.name}</span>
                {(index < creators.length - 1)?
                        <span style={{color: 'white'}}>•</span>
                        :
                        <span></span>
                        }
                  </span>
                )}  
                <span className='headerSub'>{content.info}</span>
              </div>

              
            </div>
          </div>
        </div>
    )
}
