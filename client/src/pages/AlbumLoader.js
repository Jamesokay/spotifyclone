import { ClockIcon } from '../icons/icons'

export default function AlbumLoader() {
    return (
      <div>
      <div id='tableHeader'></div>
      <table className='tableReg' cellSpacing='0' cellPadding='0'>
        <thead>
          <tr id='tableTop'>
            <th className='empty'/>
            <th className='trackHead'>#</th>
            <th>TITLE</th>
            <th className='trackHead trackFunctions'>
              <ClockIcon />
            </th>
            <th className='empty'/>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{height: '15px'}}></td>
          </tr>  
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
          <tr className='trackRow'>
            <td className='emptyCell' />
            <td className='trackCell firstCell'>
              <div className='skeletonIndex' />           
            </td> 
            <td className='trackCell'>
              <div className='skeletonTitle' />                     
              <div className='skeletonArtist' />                                            
            </td>             
            <td className='trackCell lastCell'>
              <div className='skeletonTime' />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    )
}