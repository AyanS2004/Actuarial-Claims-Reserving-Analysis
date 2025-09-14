import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
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

const ChartsDisplay = ({ results, formatCurrency }) => {
  if (!results) {
    return <div>No chart data available</div>;
  }

  const { results_summary, triangle, ultimate_claims } = results;

  // Prepare data for IBNR reserves chart
  const ibnrData = results_summary ? results_summary.map(row => ({
    originYear: row.origin_year,
    ibnrReserve: row.ibnr_reserve,
    latestPaid: row.latest_paid_claims,
    ultimate: row.ultimate_claims
  })) : [];

  // Prepare data for development pattern chart
  const developmentData = [];
  if (triangle) {
    Object.entries(triangle).forEach(([originYear, devYears]) => {
      const yearData = { originYear: parseInt(originYear) };
      Object.entries(devYears).forEach(([devYear, amount]) => {
        if (amount > 0) {
          yearData[`dev${devYear}`] = amount;
        }
      });
      developmentData.push(yearData);
    });
  }

  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            Origin Year: {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.dataKey === 'ibnrReserve' && 'IBNR Reserve: '}
              {entry.dataKey === 'latestPaid' && 'Latest Paid: '}
              {entry.dataKey === 'ultimate' && 'Ultimate Claims: '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div>
      <SectionTitle>Visualizations</SectionTitle>
      
      <InfoBox>
        <p style={{ color: '#0369a1', margin: 0 }}>
          <strong>Charts:</strong> These visualizations help interpret the Chain-Ladder analysis results. 
          The IBNR reserves chart shows future claim payments by origin year, while the development 
          pattern chart shows how claims develop over time.
        </p>
      </InfoBox>

      <ChartsContainer>
        {ibnrData.length > 0 && (
          <ChartCard>
            <ChartTitle>IBNR Reserves by Origin Year</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ibnrData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="originYear" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="ibnrReserve" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    name="IBNR Reserve"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        )}

        {developmentData.length > 0 && (
          <ChartCard>
            <ChartTitle>Claims Development Pattern</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={developmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="originYear" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name]}
                    labelFormatter={(label) => `Origin Year: ${label}`}
                  />
                  <Legend />
                  {Object.keys(developmentData[0] || {})
                    .filter(key => key.startsWith('dev'))
                    .map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={`Dev Year ${key.replace('dev', '')}`}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        )}

        {ibnrData.length > 0 && (
          <ChartCard>
            <ChartTitle>Claims Comparison: Paid vs Ultimate</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ibnrData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="originYear" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="latestPaid" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Latest Paid"
                  />
                  <Bar 
                    dataKey="ultimate" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]}
                    name="Ultimate Claims"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        )}
      </ChartsContainer>
    </div>
  );
};

export default ChartsDisplay;

