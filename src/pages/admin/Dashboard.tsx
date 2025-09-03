import { useAuth } from '@/providers/AuthProvider'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Signed in as {user?.email}</p>
      <button onClick={signOut} className="bg-gray-800 text-white px-4 py-2 rounded">
        Sign out
      </button>
    </div>
  )
}
