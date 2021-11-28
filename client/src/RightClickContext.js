import { createContext } from 'react'

export const RightClickContext = createContext({
    rightClick: {type: '',
                 yPos: 0,
                 xPos: 0,
                 id: ''},
    setRightClick: () => { }
})