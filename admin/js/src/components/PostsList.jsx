import React from 'react';

const PostsList = ({ posts, selectedPostId, onSelectPost }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="ir-text-center ir-p-4 ir-bg-gray-50 ir-rounded ir-border ir-border-gray-200">
        <p className="ir-text-gray-500">Nenhum post com imagens encontrado</p>
      </div>
    );
  }

  return (
    <div className="ir-posts-list ir-max-h-96 ir-overflow-y-auto">
      {posts.map(post => (
        <div 
          key={post.id}
          className={`ir-flex ir-items-center ir-p-3 ir-border-b ir-border-gray-200 ir-cursor-pointer ir-transition-colors ${
            selectedPostId === post.id 
              ? 'ir-bg-blue-50 ir-border-blue-200' 
              : 'hover:ir-bg-gray-50'
          }`}
          onClick={() => onSelectPost(post)}
        >
          <div className="ir-flex-1">
            <h4 className="ir-font-medium ir-text-gray-800">{post.title}</h4>
            <div className="ir-flex ir-items-center ir-mt-1">
              <span className="ir-text-sm ir-text-gray-500">
                {post.images.length} {post.images.length === 1 ? 'imagem' : 'imagens'}
              </span>
            </div>
          </div>
          <div className="ir-ml-2">
            <div className="ir-flex ir-flex-wrap ir-gap-1">
              {post.images.slice(0, 3).map((image, index) => (
                <img 
                  key={index}
                  src={image.src} 
                  alt=""
                  className="ir-w-8 ir-h-8 ir-object-cover ir-rounded ir-border ir-border-gray-300"
                />
              ))}
              {post.images.length > 3 && (
                <div className="ir-w-8 ir-h-8 ir-flex ir-items-center ir-justify-center ir-bg-gray-200 ir-rounded ir-text-xs ir-text-gray-700">
                  +{post.images.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;