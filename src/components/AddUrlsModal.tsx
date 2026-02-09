import React, { useState } from 'react';
import './AddUrlsModal.css';

interface ApiInput {
  id: number;
  label: string;
  urls: string;
}

interface AddUrlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (urlsWithLabel: Record<string, string[]>) => void;
  isLoading: boolean;
}

export function AddUrlsModal({ isOpen, onClose, onSubmit, isLoading }: AddUrlsModalProps) {
  const [apiInputs, setApiInputs] = useState<ApiInput[]>([
    { id: 1, label: '', urls: '' }
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addApiInput = () => {
    const newId = Math.max(...apiInputs.map(api => api.id), 0) + 1;
    setApiInputs([...apiInputs, { id: newId, label: '', urls: '' }]);
  };

  const removeApiInput = (id: number) => {
    if (apiInputs.length > 1) {
      setApiInputs(apiInputs.filter(api => api.id !== id));
    }
  };

  const updateApiInput = (id: number, field: 'label' | 'urls', value: string) => {
    setApiInputs(apiInputs.map(api => 
      api.id === id ? { ...api, [field]: value } : api
    ));
  };

  const handleSubmit = () => {
    setError(null);

    // Build urls_with_label object
    const urlsWithLabel: Record<string, string[]> = {};
    
    for (const apiInput of apiInputs) {
      const label = apiInput.label.trim();
      const urls = apiInput.urls
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Skip empty API inputs
      if (!label && urls.length === 0) {
        continue;
      }

      // Validate
      if (!label && urls.length > 0) {
        setError('Please provide an API name for all URL groups');
        return;
      }

      if (label && urls.length === 0) {
        setError('Please provide at least one URL for each API');
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
        setError(`Invalid URL(s) in ${label}: ${invalidUrls.slice(0, 2).join(', ')}${invalidUrls.length > 2 ? '...' : ''}`);
        return;
      }

      urlsWithLabel[label] = urls;
    }

    // Validate that at least one API has been entered
    if (Object.keys(urlsWithLabel).length === 0) {
      setError('Please add at least one API with URLs');
      return;
    }

    onSubmit(urlsWithLabel);
  };

  const handleClose = () => {
    if (!isLoading) {
      setApiInputs([{ id: 1, label: '', urls: '' }]);
      setError(null);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleClose();
    }
  };

  const hasValidInput = apiInputs.some(api => api.label.trim() && api.urls.trim());

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
            Add more API documentation to this chat session. Label each API to help the assistant distinguish between them.
          </p>

          <div className="api-inputs-container">
            {apiInputs.map((apiInput, index) => (
              <div key={apiInput.id} className="api-input-group">
                <div className="api-input-header">
                  <span className="api-input-number">API #{index + 1}</span>
                  {apiInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApiInput(apiInput.id)}
                      className="remove-api-button"
                      disabled={isLoading}
                      aria-label="Remove API"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <div className="api-input-fields">
                  <input
                    type="text"
                    value={apiInput.label}
                    onChange={(e) => updateApiInput(apiInput.id, 'label', e.target.value)}
                    placeholder="API Name (e.g., Zoom API)"
                    className="api-name-input"
                    disabled={isLoading}
                  />

                  <textarea
                    value={apiInput.urls}
                    onChange={(e) => updateApiInput(apiInput.id, 'urls', e.target.value)}
                    placeholder="https://docs.example.com/api/authentication&#10;https://docs.example.com/api/errors&#10;https://docs.example.com/api/webhooks"
                    rows={4}
                    className="url-input"
                    disabled={isLoading}
                  />
                </div>
              </div>
            ))}

            <button 
              type="button"
              onClick={addApiInput}
              className="add-api-button"
              disabled={isLoading}
            >
              + Add Another API
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          <div className="url-count">
            {Object.entries(
              apiInputs.reduce((acc, api) => {
                const urls = api.urls.split('\n').filter(line => line.trim().length > 0);
                return acc + urls.length;
              }, 0)
            )} total URL(s) across {apiInputs.filter(api => api.label.trim() && api.urls.trim()).length} API(s)
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
            disabled={isLoading || !hasValidInput}
          >
            {isLoading ? 'Adding...' : 'Add URLs'}
          </button>
        </div>
      </div>
    </div>
  );
}
