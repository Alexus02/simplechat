import hero from './assets/hero-image.jpg'
import Sidebar from './components/Sidebar'
import { ErrorBoundary } from 'react-error-boundary'
import ChatWindow from './components/ChatWindow'
import { ConversationProvider } from './context/ConversationContext'
import simpleChatlogo from './assets/logo-full.svg'
import { useState, useEffect } from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for components to mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className='w-full fixed h-screen overflow-hidden bg-cover bg-center bg-gray-darker flex items-center justify-center' style={{ backgroundImage: `url(${hero})` }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={simpleChatlogo} alt="SimpleChat Logo" className="w-32 h-auto animate-pulse" />
          <p className="text-gray-400 text-sm font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className='w-full h-screen overflow-hidden bg-cover bg-top  bg-gray-darker flex'
      style={{ 
        backgroundImage: `url(${hero})`,
        backgroundSize: '100% 180px',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll'
      }}
    >
      <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
        <>
          <div>Something went wrong: {error.message}</div>
          <button onClick={() => resetErrorBoundary()}>Reset</button>
        </>
      )}
        onError={(error, infor) => {
          console.log(error, infor);
        }
        }
      >
        <ConversationProvider>
          <Sidebar />
          <ChatWindow />
        </ConversationProvider>
      </ErrorBoundary>

    </main>
  )
}

export default App
