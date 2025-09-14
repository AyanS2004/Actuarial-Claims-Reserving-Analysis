import React from 'react';
import styled from 'styled-components';

const TriangleContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TriangleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Courier New', monospace;
`;

const TriangleHeader = styled.thead`
  background: #f8fafc;
`;

const TriangleHeaderCell = styled.th`
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #374151;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  min-width: 100px;
`;

const TriangleBody = styled.tbody``;

const TriangleRow = styled.tr``;

const TriangleCell = styled.td`
  padding: 12px 8px;
  text-align: right;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  background: ${props => props.isDiagonal ? '#fef3c7' : 'white'};
  font-weight: ${props => props.isDiagonal ? '600' : '400'};
`;

const OriginYearCell = styled.td`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 0.875rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

const TriangleInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const TriangleDisplay = ({ results, formatCurrency }) => {
  if (!results || !results.triangle) {
    return <div>No triangle data available</div>;
  }

  const { triangle, latest_claims_diagonal } = results;

  // Convert triangle data to array format for display
  const triangleData = Object.entries(triangle).map(([originYear, devYears]) => ({
    originYear: parseInt(originYear),
    ...devYears
  }));

  const developmentYears = triangleData.length > 0 ? 
    Object.keys(triangleData[0]).filter(key => key !== 'originYear').map(Number).sort() : [];

  return (
    <div>
      <SectionTitle>Cumulative Loss Triangle</SectionTitle>
      
      <TriangleInfo>
        <p style={{ color: '#0369a1', margin: 0 }}>
          <strong>Note:</strong> The highlighted diagonal represents the latest claims for each origin year, 
          which are used to calculate ultimate claims projections.
        </p>
      </TriangleInfo>

      <TriangleContainer>
        <TriangleTable>
          <TriangleHeader>
            <tr>
              <TriangleHeaderCell>Origin Year</TriangleHeaderCell>
              {developmentYears.map(devYear => (
                <TriangleHeaderCell key={devYear}>
                  Dev Year {devYear}
                </TriangleHeaderCell>
              ))}
            </tr>
          </TriangleHeader>
          <TriangleBody>
            {triangleData.map((row, index) => {
              const latestDevYear = Math.max(...developmentYears.filter(devYear => 
                row[devYear] && row[devYear] > 0
              ));
              
              return (
                <TriangleRow key={row.originYear}>
                  <OriginYearCell>{row.originYear}</OriginYearCell>
                  {developmentYears.map(devYear => (
                    <TriangleCell 
                      key={devYear}
                      isDiagonal={devYear === latestDevYear}
                    >
                      {row[devYear] && row[devYear] > 0 ? 
                        formatCurrency(row[devYear]) : 
                        '-'
                      }
                    </TriangleCell>
                  ))}
                </TriangleRow>
              );
            })}
          </TriangleBody>
        </TriangleTable>
      </TriangleContainer>

      {latest_claims_diagonal && (
        <div style={{ marginTop: '24px' }}>
          <SectionTitle>Latest Claims Diagonal</SectionTitle>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {Object.entries(latest_claims_diagonal).map(([originYear, amount]) => (
              <div key={originYear} style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                  Origin Year {originYear}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                  {formatCurrency(amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriangleDisplay;

