export default function HeaderPanel({ content, creator }) {
    return (
        <div className='headerPanel'>
            <img className='headerImage' src={content.imgUrl} alt=''/>
            <div className='headerInfo'>
            <p className='headerType'>{content.type}</p>
            <p className='headerTitle'>{content.title}</p>
            {content.type === 'PLAYLIST'?
              <div> 
                <p className='headerSub'>{content.about}</p>
                <p><span className='headerCreator'>{creator}</span><span className='headerSub'>{content.info}</span></p>
              </div>
              :
              <p><span className='headerCreator'>{creator}</span><span className='headerSub'>{content.info}</span></p>
            }
            </div>
        </div>
    )
}
