'use client'

import { useState, useEffect } from 'react'
import { AdminPageHeader } from '@/components/admin-page-header'

interface Prodi {
  id: string
  name: string
  degree: string
  requiredCourses: string
}

export default function ProdiPage() {
  const [prodis, setProdis] = useState<Prodi[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProdi, setEditingProdi] = useState<Prodi | null>(null)

  const fetchProdis = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/prodi')
    const data = await res.json()
    setProdis(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProdis()
  }, [])

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this Program Studi? This might fail if there are registrations tied to it.'
      )
    )
      return
    await fetch(`/api/admin/prodi/${id}`, { method: 'DELETE' })
    fetchProdis()
  }

  const openModal = (prodi: Prodi | null = null) => {
    setEditingProdi(prodi)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const method = editingProdi ? 'PATCH' : 'POST'
    const url = editingProdi ? `/api/admin/prodi/${editingProdi.id}` : '/api/admin/prodi'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setIsModalOpen(false)
    fetchProdis()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Program Studi"
        description="Manage available study programs"
        action={
          <button
            onClick={() => openModal()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add Program Studi
          </button>
        }
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Required Courses
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {prodis.map((prodi) => (
                <tr key={prodi.id}>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {prodi.name}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {prodi.degree}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {prodi.requiredCourses}
                  </td>
                  <td className="space-x-3 px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => openModal(prodi)}
                      className=":text-indigo-400 text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prodi.id)}
                      className=":text-red-400 text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {editingProdi ? 'Edit Program Studi' : 'Create Program Studi'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  defaultValue={editingProdi?.name}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree (e.g. S1, D4)
                </label>
                <input
                  required
                  type="text"
                  name="degree"
                  defaultValue={editingProdi?.degree}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Courses for Eligibility
                </label>
                <input
                  required
                  type="text"
                  name="requiredCourses"
                  defaultValue={editingProdi?.requiredCourses}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className=":bg-gray-600 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
