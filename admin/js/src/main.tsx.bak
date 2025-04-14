import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Definindo a interface para o objeto de configurações do WordPress
interface ImageReplacerSettings {
  root?: string
  nonce?: string
  apiEndpoint?: string
  adminUrl?: string
  isAdmin?: boolean
  isDev?: boolean
}


// Inicialização com log de depuração
console.log('main.tsx: Inicializando aplicação React...');

// Verificar se estamos em um ambiente WordPress
console.log('main.tsx: Verificando ambiente WordPress...');
console.log('main.tsx: imageReplacerSettings disponível?', !!window.imageReplacerSettings);

// Função para criar o aplicativo React
function initApp(): void {
  console.log('main.tsx: Procurando elemento de montagem...');
  const container = document.getElementById('image-replacer-app');
  
  if (container) {
    console.log('main.tsx: Elemento de montagem encontrado, renderizando React...');
    try {
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('main.tsx: Renderização iniciada com sucesso');
    } catch (error) {
      console.error('main.tsx: Erro ao renderizar React:', error instanceof Error ? error.message : String(error));
    }
  } else {
    console.error('main.tsx: Elemento de montagem #image-replacer-app não encontrado na página');
    
    // Tentativa alternativa: criar um elemento na página e montar nele
    console.log('main.tsx: Tentando criar elemento de montagem alternativo...');
    const fallbackContainer = document.createElement('div');
    fallbackContainer.id = 'image-replacer-app-fallback';
    fallbackContainer.style.margin = '20px';
    fallbackContainer.style.padding = '20px';
    fallbackContainer.style.border = '2px dashed red';
    
    // Encontrar um lugar para inserir o elemento
    const adminContent = document.querySelector('.wrap') || document.body;
    adminContent.appendChild(fallbackContainer);
    
    console.log('main.tsx: Renderizando no elemento alternativo...');

    window.addEventListener('error', (event: ErrorEvent) => {
      console.error('Erro global capturado:', event.error);
    });
    
    try {
      ReactDOM.createRoot(fallbackContainer).render(
        <React.StrictMode>
          <div style={{ color: 'red', marginBottom: '10px' }}>
            ⚠️ Elemento original não encontrado, usando fallback
          </div>
          <App />
        </React.StrictMode>
      );
      console.log('main.tsx: Renderização alternativa iniciada com sucesso');
    } catch (error) {
      console.error('main.tsx: Erro ao renderizar React no elemento alternativo:', error instanceof Error ? error.message : String(error));
    }
  }
}

// Executar a inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
  console.log('main.tsx: Aguardando carregamento do DOM...');
} else {
  console.log('main.tsx: DOM já carregado, inicializando imediatamente');
  initApp();
}