import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const UploadContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#3b82f6' : '#d1d5db'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props => props.isDragActive ? '#eff6ff' : '#f9fafb'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  color: ${props => props.isDragActive ? '#3b82f6' : '#6b7280'};
`;

const UploadText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 16px;
`;

const FileInfo = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  text-align: left;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const FileSize = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 8px;
`;

const FileUpload = ({ onFileUpload, disabled }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      console.error('File rejected:', rejectedFiles[0].errors);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    disabled: disabled
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <UploadContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadIcon isDragActive={isDragActive}>
          {isDragActive ? '📁' : '📄'}
        </UploadIcon>
        <UploadText>
          {isDragActive ? 'Drop your CSV file here' : 'Upload Insurance Claims Data'}
        </UploadText>
        <UploadSubtext>
          Drag and drop a CSV file, or click to select
        </UploadSubtext>
        <button 
          type="button" 
          className="btn btn-secondary"
          disabled={disabled}
        >
          Choose File
        </button>
      </UploadContainer>

      {acceptedFiles.length > 0 && (
        <FileInfo>
          <FileName>📄 {acceptedFiles[0].name}</FileName>
          <FileSize>Size: {formatFileSize(acceptedFiles[0].size)}</FileSize>
        </FileInfo>
      )}

      <div style={{ marginTop: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
        <strong>Expected CSV format:</strong> Policy data with columns like policy_id, subscription_length, 
        vehicle_age, customer_age, claim_status, etc. The system will automatically transform this data 
        for Chain-Ladder analysis.
      </div>
    </div>
  );
};

export default FileUpload;

