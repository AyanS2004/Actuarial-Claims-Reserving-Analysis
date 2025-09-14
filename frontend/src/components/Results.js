import React, { useState } from 'react';
import styled from 'styled-components';
import ResultsSummary from './ResultsSummary';
import TriangleDisplay from './TriangleDisplay';
import FactorsDisplay from './FactorsDisplay';
import ChartsDisplay from './ChartsDisplay';

const ResultsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const ResultsHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin: 8px 0 0 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const TabContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? 'white' : '#f1f5f9'};
    color: #3b82f6;
  }
`;

const TabContent = styled.div`
  padding: 32px;
`;

const Results = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'triangle', label: 'Loss Triangle', icon: '🔺' },
    { id: 'factors', label: 'Development Factors', icon: '📈' },
    { id: 'charts', label: 'Visualizations', icon: '📉' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num, decimals = 4) => {
    return typeof num === 'number' ? num.toFixed(decimals) : num;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <ResultsSummary results={results} formatCurrency={formatCurrency} formatNumber={formatNumber} />;
      case 'triangle':
        return <TriangleDisplay results={results} formatCurrency={formatCurrency} />;
      case 'factors':
        return <FactorsDisplay results={results} formatNumber={formatNumber} />;
      case 'charts':
        return <ChartsDisplay results={results} formatCurrency={formatCurrency} />;
      default:
        return <ResultsSummary results={results} formatCurrency={formatCurrency} formatNumber={formatNumber} />;
    }
  };

  return (
    <ResultsContainer>
      <ResultsHeader>
        <div>
          <Title>Chain-Ladder Analysis Results</Title>
          <Subtitle>
            Analysis completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Subtitle>
        </div>
        <ActionButtons>
          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            📄 Print Report
          </button>
          <button 
            className="btn btn-primary"
            onClick={onReset}
          >
            🔄 New Analysis
          </button>
        </ActionButtons>
      </ResultsHeader>

      <TabContainer>
        <TabHeader>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </TabButton>
          ))}
        </TabHeader>
        <TabContent>
          {renderTabContent()}
        </TabContent>
      </TabContainer>
    </ResultsContainer>
  );
};

export default Results;

