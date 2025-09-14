import React from 'react';
import styled from 'styled-components';

const OptionsContainer = styled.div`
  margin-top: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const OptionsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
`;

const AnalysisOptions = ({ options, onChange, disabled }) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...options,
      [field]: value
    });
  };

  return (
    <OptionsContainer>
      <OptionsTitle>Analysis Options</OptionsTitle>
      <OptionsGrid>
        <OptionGroup>
          <Label htmlFor="tailFactor">Tail Factor</Label>
          <Input
            id="tailFactor"
            type="number"
            step="0.1"
            min="0.5"
            max="2.0"
            value={options.tailFactor}
            onChange={(e) => handleInputChange('tailFactor', parseFloat(e.target.value))}
            disabled={disabled}
          />
          <HelpText>
            Factor for ultimate development (typically 1.0 for no further development)
          </HelpText>
        </OptionGroup>

        <OptionGroup>
          <Label htmlFor="method">Development Factor Method</Label>
          <Select
            id="method"
            value={options.method}
            onChange={(e) => handleInputChange('method', e.target.value)}
            disabled={disabled}
          >
            <option value="simple_average">Simple Average</option>
            <option value="weighted_average">Weighted Average</option>
            <option value="geometric_mean">Geometric Mean</option>
            <option value="median">Median</option>
          </Select>
          <HelpText>
            Method for calculating selected development factors from ATA factors
          </HelpText>
        </OptionGroup>

        <OptionGroup>
          <Label htmlFor="maxDevYears">Maximum Development Years</Label>
          <Input
            id="maxDevYears"
            type="number"
            min="3"
            max="10"
            value={options.maxDevYears || 6}
            onChange={(e) => handleInputChange('maxDevYears', parseInt(e.target.value))}
            disabled={disabled}
          />
          <HelpText>
            Maximum number of development years to analyze
          </HelpText>
        </OptionGroup>

        <OptionGroup>
          <Label htmlFor="confidenceLevel">Confidence Level</Label>
          <Select
            id="confidenceLevel"
            value={options.confidenceLevel || '95%'}
            onChange={(e) => handleInputChange('confidenceLevel', e.target.value)}
            disabled={disabled}
          >
            <option value="90%">90%</option>
            <option value="95%">95%</option>
            <option value="99%">99%</option>
          </Select>
          <HelpText>
            Confidence level for uncertainty estimates
          </HelpText>
        </OptionGroup>
      </OptionsGrid>
    </OptionsContainer>
  );
};

export default AnalysisOptions;

