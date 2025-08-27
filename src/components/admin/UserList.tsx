'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Users, Shield } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  ip_address: string | null
  created_at: string
  updated_at: string
}

export default function UserList() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
        Error loading users: {error}
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-purple-500/30">
            <tr>
              <th className="py-3 px-4 text-purple-300 font-semibold">User</th>
              <th className="py-3 px-4 text-purple-300 font-semibold">IP Address</th>
              <th className="py-3 px-4 text-purple-300 font-semibold">Joined</th>
              <th className="py-3 px-4 text-purple-300 font-semibold">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-purple-500/20 hover:bg-white/5">
                <td className="py-3 px-4">
                  <div>
                    <div className="text-white font-medium">
                      {user.full_name || 'No name provided'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {user.email}
                    </div>
                    {user.username && (
                      <div className="text-purple-400 text-sm">
                        @{user.username}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300 font-mono text-sm">
                      {user.ip_address || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {formatDate(new Date(user.created_at))}
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">
                  {formatDate(new Date(user.updated_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        Total Users: {users.length}
      </div>
    </div>
  )
}
