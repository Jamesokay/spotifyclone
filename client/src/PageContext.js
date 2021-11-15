import { createContext } from 'react'

export const PageContext = createContext({
    currentPage: {pageName: '',
                  pageUri: ''},
    setCurrentPage: () => { }
})