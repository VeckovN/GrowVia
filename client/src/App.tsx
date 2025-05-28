import { FC, ReactElement, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppRouter from './AppRoutes'

const App: FC =(): ReactElement => {

  return (
    <>
      <BrowserRouter>
        <div className='mx-auto max-w-[1320px] 0 min-h-screen bg-mainBackground'> 
          <AppRouter />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
