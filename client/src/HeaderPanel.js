export default function HeaderPanel({ content, creator, dispatch }) {

  function pageChange(pageId) {
      dispatch({
        type: 'ARTIST_PAGE',
        id: pageId
      })
    }


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
              <p><span className='headerCreator'
                onClick={() => pageChange(creator.id)}>{creator.name}</span><span className='headerSub'>{content.info}</span></p>
            }
            </div>
        </div>
    )
}
