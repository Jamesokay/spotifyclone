import { createContext } from 'react'

export const RightClickContext = createContext({
    rightClick: {type: '',
                 id: ''},
    setRightClick: () => { }
})