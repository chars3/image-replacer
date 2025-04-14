import { useState } from "react";
import { useQuery } from "react-query";
import Pagination from "./components/Pagination";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import ImageReplaceModal from "./components/ImageReplaceModal";
import PostCard from "./components/PostCard";
import api from "./services/api";

// Tipos dos dados
interface Image {
  src: string;
  alt?: string;
}

interface Post {
  id: number;
  title: string;
  images: Image[];
}

interface PostsResponse {
  posts: Post[];
  pages: number;
}

function App() {
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showReplaceModal, setShowReplaceModal] = useState<boolean>(false);
  const [lastReplacement, setLastReplacement] = useState<{
    postId: number;
    oldImage: string;
    newImage: string;
  } | null>(null);

  const { data, isLoading, error, refetch } = useQuery<PostsResponse>(
    ["posts", page, perPage],
    () => api.getPosts(page, perPage),
    {
      keepPreviousData: true,
    }
  );

  const handleOpenReplaceModal = () => {
    if (selectedPost && selectedImage) {
      setShowReplaceModal(true);
    }
  };

  const handleCloseReplaceModal = () => {
    setShowReplaceModal(false);
  };

  const handleReplaceImage = async (newImageUrl: string, oldImageUrl: string) => {
    try {
      await api.replaceImage(selectedPost!.id, oldImageUrl, newImageUrl);

      setLastReplacement({
        postId: selectedPost!.id,
        oldImage: oldImageUrl,
        newImage: newImageUrl,
      });

      setShowReplaceModal(false);
      refetch();
    } catch (err) {
      console.error("Erro ao substituir imagem:", err);
      alert("Ocorreu um erro ao substituir a imagem. Por favor, tente novamente.");
    }
  };

  const handleUndoReplace = async () => {
    if (!lastReplacement) return;

    try {
      await api.replaceImage(
        lastReplacement.postId,
        lastReplacement.newImage,
        lastReplacement.oldImage
      );

      setLastReplacement(null);
      refetch();
    } catch (err) {
      console.error("Erro ao desfazer substituição:", err);
      alert("Erro ao desfazer a substituição da imagem.");
    }
  };

  return (
    <div className="container p-6">
      <h2 className="text-2xl font-bold mb-6">Substituição de Imagens</h2>

      {lastReplacement && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-900 rounded flex justify-between items-center">
          <span>Imagem substituída com sucesso.</span>
          <button
            onClick={handleUndoReplace}
            className="ml-4 px-3 py-1 bg-yellow-300 rounded hover:bg-yellow-400 text-sm font-medium"
          >
            Desfazer
          </button>
        </div>
      )}

      {error instanceof Error && (
        <ErrorMessage message={error.message} onRetry={refetch} />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                selectedPostId={selectedPost?.id}
                onSelectImage={(post, image) => {
                  setSelectedPost(post);
                  setSelectedImage(image);
                  handleOpenReplaceModal();
                }}
              />
            ))}
          </div>

          <div className="mt-6">
            {data && (
              <Pagination
                currentPage={page}
                totalPages={data.pages || 1}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}

      {showReplaceModal && selectedPost && selectedImage && (
        <ImageReplaceModal
          post={selectedPost}
          image={selectedImage}
          onClose={handleCloseReplaceModal}
          onReplace={handleReplaceImage}
        />
      )}
    </div>
  );
}

export default App;
