import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SummaryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const CardSubtext = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
`;

const TableCellNumber = styled(TableCell)`
  text-align: right;
  font-weight: 500;
`;

const TableCellPercentage = styled(TableCell)`
  text-align: right;
  font-weight: 500;
  color: #059669;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
`;

const ResultsSummary = ({ results, formatCurrency, formatNumber }) => {
  if (!results) {
    return <div>No results available</div>;
  }

  const {
    total_ibnr_reserve,
    total_ultimate_claims,
    total_paid_claims,
    overall_ibnr_percentage,
    results_summary
  } = results;

  return (
    <div>
      <SectionTitle>Executive Summary</SectionTitle>
      
      <SummaryContainer>
        <SummaryCard>
          <CardTitle>Total IBNR Reserve</CardTitle>
          <CardValue>{formatCurrency(total_ibnr_reserve)}</CardValue>
          <CardSubtext>Future claim payments</CardSubtext>
        </SummaryCard>

        <SummaryCard>
          <CardTitle>Total Ultimate Claims</CardTitle>
          <CardValue>{formatCurrency(total_ultimate_claims)}</CardValue>
          <CardSubtext>Projected total claims</CardSubtext>
        </SummaryCard>

        <SummaryCard>
          <CardTitle>Total Paid Claims</CardTitle>
          <CardValue>{formatCurrency(total_paid_claims)}</CardValue>
          <CardSubtext>Claims already paid</CardSubtext>
        </SummaryCard>

        <SummaryCard>
          <CardTitle>IBNR Percentage</CardTitle>
          <CardValue>{formatNumber(overall_ibnr_percentage, 1)}%</CardValue>
          <CardSubtext>Of total ultimate claims</CardSubtext>
        </SummaryCard>
      </SummaryContainer>

      <SectionTitle>Detailed Results by Origin Year</SectionTitle>
      
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Origin Year</TableHeaderCell>
              <TableHeaderCell>Latest Paid Claims</TableHeaderCell>
              <TableHeaderCell>Ultimate Claims</TableHeaderCell>
              <TableHeaderCell>IBNR Reserve</TableHeaderCell>
              <TableHeaderCell>IBNR % of Ultimate</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {results_summary && results_summary.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.origin_year}</TableCell>
                <TableCellNumber>{formatCurrency(row.latest_paid_claims)}</TableCellNumber>
                <TableCellNumber>{formatCurrency(row.ultimate_claims)}</TableCellNumber>
                <TableCellNumber>{formatCurrency(row.ibnr_reserve)}</TableCellNumber>
                <TableCellPercentage>{formatNumber(row.ibnr_percentage_of_ultimate, 1)}%</TableCellPercentage>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '32px', padding: '24px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
        <h3 style={{ color: '#0369a1', marginBottom: '12px' }}>Key Insights</h3>
        <ul style={{ color: '#0c4a6e', lineHeight: '1.6' }}>
          <li>The total IBNR reserve of <strong>{formatCurrency(total_ibnr_reserve)}</strong> represents estimated future claim payments</li>
          <li>This represents <strong>{formatNumber(overall_ibnr_percentage, 1)}%</strong> of total projected ultimate claims</li>
          <li>The analysis provides a foundation for financial planning and regulatory reporting</li>
          <li>Consider additional methods (Bornhuetter-Ferguson, Cape Cod) for comparison</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsSummary;

