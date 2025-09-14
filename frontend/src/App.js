import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.div`
  padding: 20px 0;
`;

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setIsLoading(false);
    setError(null);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <div className="container">
          {!analysisResults ? (
            <Dashboard 
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
              onError={handleError}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <Results 
              results={analysisResults}
              onReset={resetAnalysis}
            />
          )}
        </div>
      </MainContent>
    </AppContainer>
  );
}

export default App;

