import { RouterProvider } from 'react-router-dom'
import './App.css'
import applicationRouter from './router/applicationRouter'

import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className='text-blue-900'>
      <SnackbarProvider>
        <RouterProvider router={applicationRouter} />
      </SnackbarProvider>
    </div>
  )
}

export default App