import { FC, ReactElement, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppRouter from './AppRoutes'

const App: FC =(): ReactElement => {

  return (
    <>
      <BrowserRouter>
        <div className='mx-auto max-w-[1320px] bg-white min-h-screen'> 
          <AppRouter />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
