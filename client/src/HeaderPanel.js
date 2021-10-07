import { useState } from 'react'

export default function HeaderPanel({ content, creators, dispatch }) {

  function pageChange(pageId) {
      dispatch({
        type: 'ARTIST_PAGE',
        id: pageId
      })
    }

    const [bg, setBg] = useState('grey')
    
    function getData() {
      var canvas = document.createElement('canvas');
      var ctx    = canvas.getContext('2d');
  
      // 2) Copy your image data into the canvas
      var myImgElement = document.getElementById('headerImage');
      myImgElement.crossOrigin = ''
      ctx.drawImage( myImgElement, 0, 0 );
  
      // 3) Read your image data
     // var w = myImgElement.width, h=myImgElement.height;
      var imgdata = ctx.getImageData(100,100,50,50);
      var rgba = imgdata.data;
      var colorRaw = rgba.slice(0,4)
      setBg('rgba(' + colorRaw.join() + ')')
      
      
    }



    return (
        <div className='headerPanel' style={{background: bg}}>
          <img  id='headerImage' src={content.imgUrl} alt='' onClick={()=> getData()}/>
            <div className='headerInfo'>
              <p className='headerType'>{content.type}</p>
              <p className='headerTitle'>{content.title}</p>
              <p>
              {creators.map((creator, index, creators) =>
               <span key={creator.id}>
                <span className='headerCreator' onClick={() => pageChange(creator.id)}>{creator.name}</span>
                {(index < creators.length - 1)?
                        <span style={{color: 'white'}}> • </span>
                        :
                        <span></span>
                        }
                  </span>
                )}  
                <span className='headerSub'>{content.info}</span>
              </p>
            </div>
        </div>
    )
}
