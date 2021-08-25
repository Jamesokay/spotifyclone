import Panel from './Panel'

export default function PanelExpanded({ title, array, dispatch }) { 
    return (
        <div style={{margin: 'auto', maxWidth: '1200px'}}>
            <p className='panelTitle'>{title}</p>
            <Panel content={array} dispatch={dispatch} />
        </div>
    )
}
