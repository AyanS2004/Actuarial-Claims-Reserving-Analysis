import React from 'react';
import styled from 'styled-components';

const FactorsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`;

const FactorCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  background: #f8fafc;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const FactorTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const FactorHeader = styled.thead`
  background: #f9fafb;
`;

const FactorHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
`;

const FactorBody = styled.tbody``;

const FactorRow = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const FactorCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
`;

const FactorCellNumber = styled(FactorCell)`
  text-align: right;
  font-weight: 500;
  font-family: 'Courier New', monospace;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const FactorsDisplay = ({ results, formatNumber }) => {
  if (!results) {
    return <div>No factors data available</div>;
  }

  const { ata_factors, selected_factors, cdfs } = results;

  return (
    <div>
      <SectionTitle>Development Factors Analysis</SectionTitle>
      
      <InfoBox>
        <p style={{ color: '#0369a1', margin: 0 }}>
          <strong>Development Factors:</strong> These factors show how claims develop from one period to the next. 
          ATA factors are calculated from the triangle, selected factors are used for projections, and CDFs 
          project claims to their ultimate values.
        </p>
      </InfoBox>

      <FactorsContainer>
        {ata_factors && (
          <FactorCard>
            <CardHeader>
              <CardTitle>Age-to-Age (ATA) Development Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <FactorTable>
                <FactorHeader>
                  <tr>
                    <FactorHeaderCell>Origin Year</FactorHeaderCell>
                    {ata_factors.columns && ata_factors.columns.map(devYear => (
                      <FactorHeaderCell key={devYear}>
                        {devYear-1} to {devYear}
                      </FactorHeaderCell>
                    ))}
                  </tr>
                </FactorHeader>
                <FactorBody>
                  {ata_factors.data && ata_factors.data.map((row, index) => (
                    <FactorRow key={index}>
                      <FactorCell>{row.origin_year}</FactorCell>
                      {ata_factors.columns.map(devYear => (
                        <FactorCellNumber key={devYear}>
                          {row[`dev_${devYear}`] ? formatNumber(row[`dev_${devYear}`], 4) : '-'}
                        </FactorCellNumber>
                      ))}
                    </FactorRow>
                  ))}
                </FactorBody>
              </FactorTable>
            </CardContent>
          </FactorCard>
        )}

        {selected_factors && (
          <FactorCard>
            <CardHeader>
              <CardTitle>Selected Development Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <FactorTable>
                <FactorHeader>
                  <tr>
                    <FactorHeaderCell>Development Period</FactorHeaderCell>
                    <FactorHeaderCell>Selected Factor</FactorHeaderCell>
                  </tr>
                </FactorHeader>
                <FactorBody>
                  {selected_factors.map((factor, index) => (
                    <FactorRow key={index}>
                      <FactorCell>{factor.period}</FactorCell>
                      <FactorCellNumber>{formatNumber(factor.factor, 4)}</FactorCellNumber>
                    </FactorRow>
                  ))}
                </FactorBody>
              </FactorTable>
            </CardContent>
          </FactorCard>
        )}

        {cdfs && (
          <FactorCard>
            <CardHeader>
              <CardTitle>Cumulative Development Factors (CDFs)</CardTitle>
            </CardHeader>
            <CardContent>
              <FactorTable>
                <FactorHeader>
                  <tr>
                    <FactorHeaderCell>Development Year</FactorHeaderCell>
                    <FactorHeaderCell>CDF</FactorHeaderCell>
                  </tr>
                </FactorHeader>
                <FactorBody>
                  {cdfs.map((cdf, index) => (
                    <FactorRow key={index}>
                      <FactorCell>{cdf.dev_year}</FactorCell>
                      <FactorCellNumber>{formatNumber(cdf.cdf, 4)}</FactorCellNumber>
                    </FactorRow>
                  ))}
                </FactorBody>
              </FactorTable>
            </CardContent>
          </FactorCard>
        )}
      </FactorsContainer>

      <div style={{ marginTop: '32px', padding: '24px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
        <h3 style={{ color: '#166534', marginBottom: '12px' }}>Factor Interpretation</h3>
        <ul style={{ color: '#14532d', lineHeight: '1.6' }}>
          <li><strong>ATA Factors &gt; 1.0:</strong> Claims are still developing (increasing)</li>
          <li><strong>ATA Factors = 1.0:</strong> Claims have reached ultimate (no further development)</li>
          <li><strong>ATA Factors &lt; 1.0:</strong> Claims are decreasing (rare, may indicate recoveries)</li>
          <li><strong>CDFs:</strong> Multiply latest claims by CDF to get ultimate claims</li>
        </ul>
      </div>
    </div>
  );
};

export default FactorsDisplay;

