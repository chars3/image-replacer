import React, { useState, useEffect } from 'react';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wpSettings, setWpSettings] = useState(null);

  useEffect(() => {
    // Verificar se as configurações do WordPress estão disponíveis
    if (window.imageReplacerSettings) {
      setWpSettings(window.imageReplacerSettings);
    }
    
    // Marcar que o componente foi carregado
    setIsLoaded(true);
    
    // Registrar no console para depuração
    console.log('React App carregado com sucesso!');
    console.log('Settings do WordPress:', window.imageReplacerSettings);
  }, []);

  return (
    <div className="ir-app-test" style={{ padding: '20px', border: '2px solid #0073aa', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: '#0073aa' }}>Teste de Carregamento do React</h2>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
        <p><strong>Status:</strong> {isLoaded ? '✅ React carregado com sucesso!' : '⏳ Carregando...'}</p>
        
        <p><strong>WordPress Settings:</strong> {wpSettings ? '✅ Disponível' : '❌ Não disponível'}</p>
        
        {wpSettings && (
          <div style={{ marginTop: '10px' }}>
            <h4>Detalhes das configurações:</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li><strong>API Endpoint:</strong> {wpSettings.apiEndpoint || 'Não disponível'}</li>
              <li><strong>Admin URL:</strong> {wpSettings.adminUrl || 'Não disponível'}</li>
              <li><strong>Dev Mode:</strong> {wpSettings.isDev ? 'Sim' : 'Não'}</li>
              <li><strong>Admin Permissions:</strong> {wpSettings.isAdmin ? 'Sim' : 'Não'}</li>
            </ul>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Se você está vendo esta mensagem, o React foi carregado corretamente!</p>
        <p>Verifique o console do navegador para mais informações de depuração.</p>
        <button 
          onClick={() => alert('Clique funcionando! O React está operando corretamente.')} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#0073aa',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clique para testar interatividade
        </button>
      </div>
    </div>
  );
}

export default App;