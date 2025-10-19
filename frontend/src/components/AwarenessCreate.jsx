"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { createAwarenessResource, fetchFlairs } from "../api/awareness"
import { useEffect } from "react"

export default function AwarenessCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [flairs, setFlairs] = useState([])
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    synopsis: "",
    flair: "",
    image: null,
  })

  useEffect(() => {
    const loadFlairs = async () => {
      try {
        const data = await fetchFlairs()
        setFlairs(data)
      } catch (err) {
        console.error("Failed to load flairs:", err)
      }
    }
    loadFlairs()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("author", formData.author)
      formDataToSend.append("synopsis", formData.synopsis || formData.content.slice(0, 120))
      if (formData.flair) {
        formDataToSend.append("flair", formData.flair)
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      const response = await createAwarenessResource(formDataToSend)
      navigate(`/awareness/${response.id}`)
    } catch (err) {
      setError(err.message || "Failed to create article. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-indigo-500/20 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Create New Article</h1>
          <p className="text-slate-400">Share your cybersecurity insights with the community</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-indigo-600/10 backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-8">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-200 mb-3">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter article title"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-slate-200 mb-3">
                Author Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="flair" className="block text-sm font-semibold text-slate-200 mb-3">
                Category
              </label>
              <select
                id="flair"
                name="flair"
                value={formData.flair}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="">Select a category</option>
                {flairs.map((flair) => (
                  <option key={flair.id} value={flair.id}>
                    {flair.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Synopsis Field */}
            <div>
              <label htmlFor="synopsis" className="block text-sm font-semibold text-slate-200 mb-3">
                Synopsis
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                placeholder="Brief summary of the article (optional)"
                rows="2"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-slate-200 mb-3">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your article content here..."
                rows="10"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none font-mono text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-slate-200 mb-3">
                Featured Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/30 transition-all"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <p className="text-slate-300 font-medium">Click to upload image</p>
                    <p className="text-slate-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-slate-400 mb-2">Preview:</p>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 md:px-12 py-6 bg-slate-900/30 border-t border-slate-700/50 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                "Publish Article"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
