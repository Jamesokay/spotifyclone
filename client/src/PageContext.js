import { createContext } from 'react'

export const PageContext = createContext({
    currentPage: '',
    setCurrentPage: () => { }
})