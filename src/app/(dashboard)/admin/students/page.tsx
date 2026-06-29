'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/roles'

interface ParentInfo {
  id: string
  name: string
  email: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
  age: number
  grade: string
  enrollmentDate: string
  parentStudents: { parent: ParentInfo }[]
}

export default function AdminStudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== Role.ADMIN) router.push('/parent/dashboard')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchStudents()
  }, [status])

  async function fetchStudents() {
    try {
      const res = await fetch('/api/admin/students')
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete student "${name}" and all their payment records? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      await fetchStudents()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete student')
    }
  }

  const filtered = search
    ? students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.grade.toLowerCase().includes(search.toLowerCase()) ||
        s.parentStudents.some(p => p.parent.name.toLowerCase().includes(search.toLowerCase()))
      )
    : students

  if (status === 'loading' || loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, grade, or parent..."
          className="w-72 border dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">{search ? 'No students match your search.' : 'No students enrolled yet.'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Grade</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Age</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Parent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Enrolled</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.grade}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{s.age}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {s.parentStudents.map(p => p.parent.name).join(', ') || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(s.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700">
            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
