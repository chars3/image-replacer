import React from "react";

interface Image {
  src: string;
  alt?: string;
  type?: "featured" | "content";
}

interface Post {
  id: number;
  title: string;
  images: Image[];
}

interface PostCardProps {
  post: Post;
  onSelectImage: (post: Post, image: Image) => void;
  selectedPostId?: number;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelectImage,
  selectedPostId,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border ${selectedPostId === post.id ? "border-blue-500" : "border-transparent"
        }`}
    >
      <h3 className="text-lg font-semibold mb-2">
        <a
          href={`/index.php?p=${post.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline"
        >
          {post.title}
        </a>
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {post.images.map((image, index) => {
          const imageWithType = {
            ...image,
            type: index === 0 ? 'featured' as const : 'content' as const,
          };

          return (
            <img
              key={index}
              src={image.src}
              alt={image.alt || ""}
              className="rounded cursor-pointer transition hover:opacity-80"
              onClick={() => onSelectImage(post, imageWithType)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PostCard;
