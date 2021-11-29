import { createContext } from 'react'

export const NotificationContext = createContext({
    notification:  {text: '',
                    action: ''},
    setNotification: () => { }
})