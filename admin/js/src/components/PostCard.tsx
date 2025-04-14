import React from 'react'

interface Image {
  src: string
  alt?: string
}

interface Post {
  id: number
  title: string
  images: Image[]
}

interface PostCardProps {
  post: Post
  onSelectImage: (post: Post, image: Image) => void
  selectedPostId?: number
}

const PostCard: React.FC<PostCardProps> = ({ post, onSelectImage, selectedPostId }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border ${
        selectedPostId === post.id ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt || ''}
            className="rounded cursor-pointer transition hover:opacity-80"
            onClick={() => onSelectImage(post, image)}
          />
        ))}
      </div>
    </div>
  )
}

export default PostCard
