import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { Heart, ArrowLeft, Share2, Flag, Eye, ThumbsUp, MessageCircle } from "lucide-react"

export default function ItemDetail() {
    const { id } = useParams()
    const { items, currentUser, favorites, toggleFavorite, addNotification, redeemItem, updateItem, createConversation } =
        useApp()

    const navigate = useNavigate()
    const [selectedImage, setSelectedImage] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    const item = items.find((item) => item.id === Number.parseInt(id))
    const isFavorited = favorites.includes(Number.parseInt(id))

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    // Increment view count only once when component mounts
    useEffect(() => {
        if (item && currentUser?.id !== item.uploaderId) {
            // Use a ref or state to track if we've already incremented views
            const hasIncrementedViews = sessionStorage.getItem(`item-${id}-viewed`)
            if (!hasIncrementedViews) {
                updateItem(item.id, { views: (item.views || 0) + 1 })
                sessionStorage.setItem(`item-${id}-viewed`, 'true')
            }
        }
    }, [id, item?.id, currentUser?.id, updateItem])

    if (!item) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">😞</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Item not found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">This item may have been removed or doesn't exist.</p>
                    <button
                        onClick={() => navigate("/browse")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Back to Browse
                    </button>
                </div>
            </div>
        )
    }

    const handleSwapRequest = () => {
        if (!currentUser) {
            navigate("/login")
            return
        }

        const conversationId = createConversation(item.uploaderId, item.id)
        addNotification("Swap request sent! Check your messages.", "success")
        navigate(`/messages?conversation=${conversationId}`)
    }

    const handleRedeem = () => {
        if (!currentUser) {
            navigate("/login")
            return
        }

        if (redeemItem(item.id)) {
            navigate("/dashboard")
        }
    }

    const handleFavoriteToggle = () => {
        if (!currentUser) {
            navigate("/login")
            return
        }
        toggleFavorite(item.id)
    }

    const handleShare = async () => {
        const shareData = {
            title: item.title,
            text: item.description,
            url: window.location.href,
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData)
                addNotification("Shared successfully!", "success")
            } catch (error) {
                if (error.name !== "AbortError") {
                    fallbackShare()
                }
            }
        } else {
            fallbackShare()
        }
    }

    const fallbackShare = () => {
        navigator.clipboard.writeText(window.location.href)
        addNotification("Link copied to clipboard!", "success")
    }

    const handleReport = () => {
        addNotification("Item reported. We'll review it shortly.", "info")
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative">
                            <img
                                src={item.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                                alt={item.title}
                                className={`w-full h-96 object-cover rounded-lg cursor-zoom-in transition-transform duration-300 ${
                                    isZoomed ? "scale-150" : "scale-100"
                                }`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            />

                            {/* Action buttons overlay */}
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <button
                                    onClick={handleFavoriteToggle}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                                        isFavorited
                                            ? "bg-red-500 text-white shadow-lg"
                                            : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white"
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-all duration-200"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleReport}
                                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white backdrop-blur-sm transition-all duration-200"
                                >
                                    <Flag className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                                        item.status === "available"
                                            ? "bg-green-500/90 text-white"
                                            : item.status === "pending"
                                                ? "bg-yellow-500/90 text-white"
                                                : "bg-gray-500/90 text-white"
                                    }`}
                                >
                                    {item.status === "available" ? "Available" : item.status === "pending" ? "Pending" : "Sold"}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail gallery */}
                        {item.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {item.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                                            selectedImage === index
                                                ? "border-green-500 ring-2 ring-green-200 dark:ring-green-800"
                                                : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                                        }`}
                                    >
                                        <img
                                            src={image || "/placeholder.svg?height=100&width=100"}
                                            alt={`${item.title} ${index + 1}`}
                                            className="w-full h-20 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="space-y-6">
                        {/* Title and Stats */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{item.views} views</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{item.likes} likes</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
                        </div>

                        {/* Item Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Category</h4>
                                <p className="text-gray-600 dark:text-gray-400">{item.category}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Type</h4>
                                <p className="text-gray-600 dark:text-gray-400">{item.type}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Size</h4>
                                <p className="text-gray-600 dark:text-gray-400">{item.size}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Condition</h4>
                                <p className="text-gray-600 dark:text-gray-400">{item.condition}</p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
                                        onClick={() => navigate(`/browse?search=${encodeURIComponent(tag)}`)}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Listed by</h4>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">{item.uploaderName.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.uploaderName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{item.points} points</div>
                                    {currentUser && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Your balance: <span className="font-semibold">{currentUser.points} points</span>
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated value</p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">${item.points * 2}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {item.status === "available" && currentUser?.id !== item.uploaderId && (
                            <div className="space-y-3">
                                <button
                                    onClick={handleSwapRequest}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Send Swap Request</span>
                                </button>
                                <button
                                    onClick={handleRedeem}
                                    disabled={currentUser && currentUser.points < item.points}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                        currentUser && currentUser.points >= item.points
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {currentUser && currentUser.points < item.points
                                        ? `Need ${item.points - currentUser.points} more points`
                                        : "Redeem with Points"}
                                </button>
                            </div>
                        )}

                        {!currentUser && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                                >
                                    Login to Swap or Redeem
                                </button>
                            </div>
                        )}

                        {currentUser?.id === item.uploaderId && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-200 font-medium">This is your listing.</p>
                                <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                                    You can edit or remove it from your dashboard.
                                </p>
                            </div>
                        )}

                        {item.status !== "available" && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    This item is {item.status === "pending" ? "pending approval" : "no longer available"}.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
