export default function HeaderPanel({ content }) {
    return (
        <div className='headerPanel'>
            <img className='headerImage' src={content.imgUrl} alt=''/>
            <div className='headerInfo'>
            <p className='headerType'>{content.type}</p>
            <p className='headerTitle'>{content.title}</p>
            <p className='headerSub'>{content.about}</p>
            </div>
        </div>
    )
}
