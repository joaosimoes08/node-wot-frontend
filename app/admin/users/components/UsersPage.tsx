'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserIcon } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`/api/proxy?path=/api/users`)
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('[ERRO] Ao obter utilizadores:', err)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (id: string, newRole: 'admin' | 'member') => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    )

    try {
      await fetch(`/api/proxy?path=/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
    } catch (err) {
      console.error('[ERRO] Ao atualizar role do user', err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="w-6 h-6" />
        Utilizadores
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    handleRoleChange(user.id, value as 'admin' | 'member')
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UsersPage
