import { FC, ReactElement, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import AppRouter from './AppRoutes'
import { useAppDispatch, useAppSelector } from './store/store';
import { connectSocket, disconnectSocket } from './sockets/socket';
import { registerNotificationEvents } from './sockets/registerSocketEvents';
import { ReduxStateInterface } from './store/store.interface';
import ScrollToTop from './features/ScrollToTop';

const App: FC =(): ReactElement => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: ReduxStateInterface) => state.authUser)

  useEffect(() => {
    if (!authUser?.id) return;
    const socket = connectSocket(); //singleton instance
 
    registerNotificationEvents(socket, dispatch, authUser?.id, authUser?.userType);

    return () => { //clean up
      disconnectSocket(); //on app close, disconnect it from socket intance
    }
  },[authUser?.id])

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <div className='mx-auto max-w-[1320px] 0 min-h-screen bg-mainBackground'> 
          <AppRouter />
        </div>

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
