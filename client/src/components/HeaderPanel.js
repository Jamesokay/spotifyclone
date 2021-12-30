import { useState, useEffect, useContext } from 'react'
import { ThemeContext, PageContext, SideBarWidthContext } from '../contexts'
import useViewport from '../hooks/useViewPort'



export default function HeaderPanel({ content, type, creators, creatorImg, isOwner }) {

    const { setCurrentTheme } = useContext(ThemeContext)
    const { setCurrentPage } = useContext(PageContext)
    const [loading, setLoading] = useState(true)
    const [titleSize, setTitleSize] = useState(0)
    const [gradient, setGradient] = useState('linear-gradient(grey, #121212)')
    const [edgeColour, setEdgeColour] = useState('')
    const [imgSize, setImgSize] = useState(232)
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointLarge = 1065
    const breakPointSmall = 800

    function calculateFontSize(title) {
      if (title.length <= 20) {
        setTitleSize(600)
      }
      else if (title.length > 20 && title.length <= 30) {
        setTitleSize(425)
      }
      else if (title.length > 30) {
        setTitleSize(325)
      }
    }

    useEffect(() => {
      if (!content.title) return
      calculateFontSize(content.title)    
    }, [content.title])
    

    useEffect(() => {
        if ((width - currentWidth) <= breakPointSmall) {
          setImgSize(195)
        }
        else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) <= breakPointLarge) {
          setImgSize(195)
        }
        else if ((width - currentWidth) >= breakPointLarge) {
          setImgSize(232)
        }

        return function cleanUp() {
          setImgSize(232)
        }
    }, [width, currentWidth])


    useEffect(() => {
      if (!content.title) return
      if (content.title === 'Liked Songs') return

      setCurrentPage({pageName: content.title,
                      pageUri: content.uri
      })

    }, [content, content.title, content.uri, setCurrentPage])


      


    
    function getData() {
      var canvas = document.createElement('canvas');
      var ctx    = canvas.getContext('2d');
  
      var myImgElement = document.getElementById('headerImage');
      myImgElement.crossOrigin = ''
      
      canvas.height = myImgElement.naturalHeight
      canvas.width = myImgElement.naturalWidth
      ctx.drawImage( myImgElement, 0, 0 );

     
      var yStart = Math.floor(canvas.height * 0.5)
      var xStartEdge = Math.floor(canvas.width * 0.95)
  

      var imgdata = ctx.getImageData(0,yStart,50,50);
      var imgdataEdge = ctx.getImageData(xStartEdge, yStart, 20, 20)
      var pixels = imgdata.data;
      var pixelsEdge = imgdataEdge.data

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

      var redEdge = 0
      var greenEdge = 0
      var blueEdge = 0

      for (let i = 0; i < pixelsEdge.length; i += 4) {
        
        redEdge += pixelsEdge[i]
        greenEdge += pixelsEdge[i + 1]
        blueEdge += pixelsEdge[i + 2]
        
      }


      let avgRed = Math.floor(red / (pixels.length / 4))
      let avgGreen = Math.floor(green / (pixels.length / 4))
      let avgBlue = Math.floor(blue / (pixels.length / 4))
      let avgAlpha = Math.floor(alpha / (pixels.length / 4))

      let avgRedEdge = Math.floor(redEdge / (pixelsEdge.length / 4))
      let avgGreenEdge = Math.floor(greenEdge / (pixelsEdge.length / 4))
      let avgBlueEdge = Math.floor(blueEdge / (pixelsEdge.length / 4))


      let bg = 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ',' + avgAlpha + ')'
      setEdgeColour('rgb(' + avgRedEdge + ',' + avgGreenEdge + ',' + avgBlueEdge + ')')
      setGradient('linear-gradient(' + bg + ', rgb(18, 18, 18))')
      setCurrentTheme({red: avgRed, green: avgGreen, blue: avgBlue})
      setLoading(false)     
      
    }



    return type === 'ARTIST'? (
      <div id='headerPanelUpper' style={{backgroundColor: edgeColour}}>    
        {(content.imgUrl)?
          <div>
            <div className='headerBG' style={{backgroundImage: "url(" + content.imgUrl + ")", boxShadow: '0 0 20px 20px ' + edgeColour + ' inset'}}/>      
            <img id='headerImage' style={{visibility: 'hidden'}} src={content.imgUrl} alt='' onLoad={()=> getData()}/>
          </div>
          :
          <></>
        } 
          <div className='headerInfoArtist'>
            <span className='headerTitle' style={{fontSize: titleSize +'%'}}>{content.title}</span>
            {(content.followers)?
            <span className='headerSubArtist'>{content.followers + ' followers'}</span>
            :
            <></>
            }
          </div>
         
      

      </div>
    )
    :
    (
        <div id='headerPanel' style={(loading)? {visibility: 'hidden'} : {visibility: 'visible', backgroundImage: gradient}}>
        <div className='headerBody' style={((width - currentWidth) <= breakPointSmall)? {marginLeft: 'max(1.125vw, 16px)'} : {}}>
        {(content.imgUrl)?
        <div className='headerImageBox'>
          <img id='headerImage' src={content.imgUrl} alt='' onLoad={()=> getData()} style={{width: imgSize, height: imgSize, minWidth: imgSize}}/>
        </div>
          : 
          <div id='headerImage'/>
        }
          
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
          <div className='headerInfoBox'>
            <div className='headerInfo'>
              <span className='headerType'>{content.type}</span>
              <span className='headerTitle' style={(imgSize === 232)? {fontSize: titleSize + '%'} : {fontSize: (titleSize * 0.75) + '%'}}>{content.title}</span>
              {(content.type === 'PLAYLIST')?
              <span className='headerSub'>{content.about}</span>
              :
              <></>
              }
              
              <div>
              {(content.type === 'ALBUM' && creatorImg)?
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
        </div>
    )
}
