import { useState } from 'react'
import { useQuery } from 'react-query'
import PostsList from './components/PostsList'
import Pagination from './components/Pagination'
import ImageViewer from './components/ImageViewer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import ImageReplaceModal from './components/ImageReplaceModal'
import api from './services/api.js'

function App() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  
  // Consulta para buscar posts com imagens
  const { data, isLoading, error, refetch } = useQuery(
    ['posts', page, perPage],
    () => api.getPosts(page, perPage),
    {
      keepPreviousData: true,
    }
  )
  
  // Função para selecionar um post e suas imagens
  const handleSelectPost = (post) => {
    setSelectedPost(post)
    setSelectedImage(null)
  }
  
  // Função para selecionar uma imagem específica
  const handleSelectImage = (image) => {
    setSelectedImage(image)
  }
  
  // Função para abrir o modal de substituição
  const handleOpenReplaceModal = () => {
    if (selectedPost && selectedImage) {
      setShowReplaceModal(true)
    }
  }
  
  // Função para fechar o modal de substituição
  const handleCloseReplaceModal = () => {
    setShowReplaceModal(false)
  }
  
  // Função para realizar a substituição da imagem
  const handleReplaceImage = async (newImageUrl) => {
    try {
      await api.replaceImage(selectedPost.id, selectedImage.src, newImageUrl)
      setShowReplaceModal(false)
      refetch() // Recarrega a lista para mostrar as alterações
    } catch (err) {
      console.error("Erro ao substituir imagem:", err)
      alert("Ocorreu um erro ao substituir a imagem. Por favor, tente novamente.")
    }
  }
  
  return (
    <div className="ir-container ir-p-4">
      <h2 className="ir-text-2xl ir-font-bold ir-mb-4">Substituição de Imagens</h2>
      
      {error && <ErrorMessage message="Erro ao carregar posts. Por favor, tente novamente." />}
      
      <div className="ir-grid ir-grid-cols-1 ir-gap-4 md:ir-grid-cols-3">
        <div className="ir-col-span-1">
          <div className="ir-card">
            <h3 className="ir-text-lg ir-font-medium ir-mb-4">Posts com Imagens</h3>
            
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <PostsList 
                  posts={data?.posts || []} 
                  selectedPostId={selectedPost?.id} 
                  onSelectPost={handleSelectPost} 
                />
                
                {data && (
                  <Pagination 
                    currentPage={page} 
                    totalPages={data.pages || 1} 
                    onPageChange={setPage} 
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="ir-col-span-2">
          <div className="ir-card">
            <h3 className="ir-text-lg ir-font-medium ir-mb-4">
              {selectedPost ? `Imagens em: ${selectedPost.title}` : 'Selecione um post para ver suas imagens'}
            </h3>
            
            {selectedPost && (
              <ImageViewer 
                images={selectedPost.images} 
                selectedImage={selectedImage} 
                onSelectImage={handleSelectImage} 
              />
            )}
            
            {selectedImage && (
              <div className="ir-mt-4 ir-text-right">
                <button 
                  onClick={handleOpenReplaceModal} 
                  className="ir-button-primary"
                >
                  Substituir Imagem Selecionada
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showReplaceModal && (
        <ImageReplaceModal 
          post={selectedPost}
          image={selectedImage}
          onClose={handleCloseReplaceModal}
          onReplace={handleReplaceImage}
        />
      )}
    </div>
  )
}

export default App;