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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className='w-full h-dvh overflow-hidden bg-cover bg-center bg-gray-darker flex items-center justify-center' style={{ backgroundImage: `url(${hero})` }}>
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={simpleChatlogo} alt="SimpleChat Logo" className="w-32 h-auto animate-pulse" />
          <p className="text-gray-400 text-sm font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className='w-full h-dvh overflow-hidden gap-[20px] bg-gray-darker flex'
      style={{
        backgroundImage: `url(${hero})`,
        backgroundSize: '100% 180px',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll'
      }}
    >
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="flex items-center justify-center w-full h-full text-white">
            <div>Something went wrong: {error.message}</div>
            <button onClick={() => resetErrorBoundary()}>Reset</button>
          </div>
        )}
        onError={(error, info) => console.log(error, info)}
      >
        <ConversationProvider>
          <div className="flex h-full w-full min-h-0 min-w-0">
            <Sidebar />
           <div className="flex-1 min-w-0 min-h-0 h-full flex justify-center items-center overflow-hidden">
              <ChatWindow />
              </div>

          </div>
        </ConversationProvider>
      </ErrorBoundary>
    </main>
  )
}

export default App
