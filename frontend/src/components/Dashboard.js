import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './FileUpload';
import AnalysisOptions from './AnalysisOptions';
import axios from 'axios';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 0;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const LoadingMessage = styled.div`
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 48px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: white;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const Dashboard = ({ onAnalysisComplete, onAnalysisStart, onError, isLoading, error }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisOptions, setAnalysisOptions] = useState({
    tailFactor: 1.0,
    method: 'simple_average'
  });

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleAnalysisOptionsChange = (options) => {
    setAnalysisOptions(options);
  };

  const runAnalysis = async () => {
    if (!uploadedFile) {
      onError('Please upload a CSV file first');
      return;
    }

    onAnalysisStart();

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('options', JSON.stringify(analysisOptions));

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onAnalysisComplete(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      onError(err.response?.data?.error || 'An error occurred during analysis');
    }
  };

  return (
    <DashboardContainer>
      <HeroSection>
        <HeroTitle>Claims Reserving Analysis</HeroTitle>
        <HeroSubtitle>
          Professional Chain-Ladder method implementation for actuarial claims reserving
        </HeroSubtitle>
      </HeroSection>

      <ContentCard>
        {error && (
          <ErrorMessage>
            <strong>Error:</strong> {error}
          </ErrorMessage>
        )}

        {isLoading && (
          <LoadingMessage>
            <div className="loading"></div>
            Running Chain-Ladder analysis... This may take a few moments.
          </LoadingMessage>
        )}

        <FileUpload onFileUpload={handleFileUpload} disabled={isLoading} />
        
        <AnalysisOptions 
          options={analysisOptions}
          onChange={handleAnalysisOptionsChange}
          disabled={isLoading}
        />

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            className="btn btn-primary"
            onClick={runAnalysis}
            disabled={!uploadedFile || isLoading}
            style={{ fontSize: '16px', padding: '16px 32px' }}
          >
            {isLoading ? (
              <>
                <div className="loading"></div>
                Analyzing...
              </>
            ) : (
              'Run Chain-Ladder Analysis'
            )}
          </button>
        </div>
      </ContentCard>

      <FeatureGrid>
        <FeatureCard>
          <FeatureIcon>📈</FeatureIcon>
          <FeatureTitle>Chain-Ladder Method</FeatureTitle>
          <FeatureDescription>
            Industry-standard technique for estimating future claim payments using historical development patterns
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Comprehensive Analysis</FeatureTitle>
          <FeatureDescription>
            Calculate ATA factors, CDFs, ultimate claims, and IBNR reserves with detailed visualizations
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Professional Reports</FeatureTitle>
          <FeatureDescription>
            Generate actuarial-quality reports suitable for regulatory filing and financial planning
          </FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </DashboardContainer>
  );
};

export default Dashboard;

