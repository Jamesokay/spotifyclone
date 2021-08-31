export default function HeaderPanel({ content, creators, dispatch }) {

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