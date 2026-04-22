import { trpc } from './trpc'

function App() {
  const health = trpc.health.useQuery()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">React Blog</h1>
          <p className="text-gray-500 mt-1">
            {health.isLoading ? 'Connecting...' : health.data?.status || 'Server offline'}
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <p className="text-gray-600">Welcome to React Blog v2.0</p>
      </main>
    </div>
  )
}

export default App
