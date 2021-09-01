import Panel from './Panel'

export default function PanelExpanded({ title, array, dispatch }) { 
    return (
        <div className='page'>
            <p className='panelTitle'>{title}</p>
            <Panel content={array} dispatch={dispatch} />
        </div>
    )
}
