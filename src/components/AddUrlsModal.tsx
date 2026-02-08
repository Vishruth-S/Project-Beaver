import React, { useState } from 'react';
import './AddUrlsModal.css';

interface AddUrlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (urls: string[]) => void;
  isLoading: boolean;
}

export function AddUrlsModal({ isOpen, onClose, onSubmit, isLoading }: AddUrlsModalProps) {
  const [urlsText, setUrlsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError(null);

    // Parse URLs from textarea (one per line)
    const urls = urlsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Validate URLs
    if (urls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    // Basic URL validation
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      setError(`Invalid URL(s): ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
      return;
    }

    onSubmit(urls);
  };

  const handleClose = () => {
    if (!isLoading) {
      setUrlsText('');
      setError(null);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Documentation URLs</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Enter additional documentation URLs to include in this chat session (one per line):
          </p>

          <textarea
            className="url-input"
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            placeholder="https://docs.example.com/api/authentication&#10;https://docs.example.com/api/errors&#10;https://docs.example.com/api/webhooks"
            rows={8}
            disabled={isLoading}
            autoFocus
          />

          {error && (
            <div className="error-message">
              {error.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          <div className="url-count">
            {urlsText.split('\n').filter(line => line.trim().length > 0).length} URL(s)
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isLoading || urlsText.trim().length === 0}
          >
            {isLoading ? 'Adding...' : 'Add URLs'}
          </button>
        </div>
      </div>
    </div>
  );
}
