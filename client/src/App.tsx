import { FC, ReactElement, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

import AppRouter from './AppRoutes'

const App: FC =(): ReactElement => {

  return (
    <>
      <BrowserRouter>
        <div className='mx-auto max-w-[1320px] 0 min-h-screen bg-mainBackground'> 
          <AppRouter />
        </div>

         {/*
          Global Toast Configuration:
          - Pre-defines styles for all toast types (default, success, error)
          - Actual toast calls are managed via toastUtils.ts wrappers ('showSuccess', 'showError', etc)
          - Custom toasts (upload progress, etc) use these base styles
        */}
        <Toaster
          position='top-right'
          containerClassName="mt-12"
          toastOptions={{
            className: "bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg",
            
            success: {
              className:"bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg",
              iconTheme: {
                primary: '#34d399',
                secondary: '#ecfdf5',
              },
            },
            error: {
              className: "bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg",
                iconTheme: {
                  primary: '#f87171',
                  secondary: '#fee2e2',
                },
            }
          }}
        />

      </BrowserRouter>
    </>
  )
}

export default App
