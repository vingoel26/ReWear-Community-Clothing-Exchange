
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/AppContext"

export default function AddItem() {
  const { addItem } = useApp()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    points: 20,
  })
  const [images, setImages] = useState([])

  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]
  const conditions = ["Like New", "Excellent", "Good", "Fair"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload these to a server
    // For now, we'll use placeholder images
    const newImages = files.map(() => "/placeholder.svg?height=400&width=400")
    setImages([...images, ...newImages].slice(0, 4)) // Max 4 images
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const itemData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      images: images.length > 0 ? images : ["/placeholder.svg?height=400&width=400"],
      points: Number.parseInt(formData.points),
    }

    addItem(itemData)
    alert("Item submitted for review! It will be available once approved by an admin.")
    navigate("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List a New Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 4)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <span className="text-gray-600">Click to upload images</span>
              <span className="text-sm text-gray-500">PNG, JPG up to 10MB each</span>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Vintage Denim Jacket"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Describe the item, its condition, and any special features..."
          />
        </div>

        {/* Category and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <input
              type="text"
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., T-shirt, Jeans, Sneakers"
            />
          </div>
        </div>

        {/* Size and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size *
            </label>
            <select
              id="size"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a size</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="vintage, casual, summer (comma-separated)"
          />
          <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        {/* Points */}
        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700">
            Point Value *
          </label>
          <input
            type="number"
            id="points"
            name="points"
            required
            min="1"
            max="100"
            value={formData.points}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">Suggested: 10-30 points for most items</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
          >
            Submit for Review
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
