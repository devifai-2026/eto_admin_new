import React, { useState, useEffect } from "react";
import {
  FiX,
  FiDownload,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

const DocumentViewerModal = ({ documentUrl, documentName, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    // Reset states when document changes
    setScale(1);
    setRotation(0);
    setLoading(true);
    setError(null);

    // Determine file type
    if (documentUrl) {
      const isImage = documentUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
      const isPDF = documentUrl.match(/\.(pdf)$/i);

      if (isImage) {
        setFileType("image");
      } else if (isPDF) {
        setFileType("pdf");
      } else {
        setFileType("other");
      }

      // Pre-load the document
      if (isImage) {
        const img = new Image();
        img.src = documentUrl;
        img.onload = () => {
          setLoading(false);
          setError(null);
        };
        img.onerror = () => {
          setLoading(false);
          setError(
            "Failed to load document. The file may be corrupted or inaccessible."
          );
        };
      } else {
        // For non-images, set loading to false after a short delay
        setTimeout(() => setLoading(false), 300);
      }
    }
  }, [documentUrl]);

  const handleDownload = () => {
    if (!documentUrl) return;

    try {
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = documentName || "document";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // For Safari/iOS support
      if (documentUrl.startsWith("blob:")) {
        window.open(documentUrl, "_blank");
      }
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: open in new tab
      window.open(documentUrl, "_blank");
    }
  };

  const handleZoomIn = () => {
    if (scale < 3) {
      setScale((prev) => Math.min(3, prev + 0.25));
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale((prev) => Math.max(0.5, prev - 0.25));
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(
      "Failed to load image. The file may be corrupted or the URL is invalid."
    );
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const renderDocumentContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4">
            <FiLoader className="w-full h-full text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading document...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
          <div className="text-red-500 text-6xl mb-4">
            <FiAlertCircle className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Document
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            {error}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <FiDownload />
              <span>Try Downloading</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    switch (fileType) {
      case "image":
        return (
          <div className="flex items-center justify-center min-h-[60vh] p-4">
            <img
              src={documentUrl}
              alt={documentName || "Document"}
              className="max-w-full max-h-[70vh] object-contain"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease",
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        );

      case "pdf":
        return (
          <div className="w-full h-full">
            <iframe
              src={documentUrl}
              className="w-full h-[70vh] border-0"
              title={documentName || "PDF Document"}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(
                  "Failed to load PDF. Please try downloading the file."
                );
              }}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📄
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Preview Not Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              Preview is not available for this file type. Please download the
              file to view it.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <FiDownload />
                <span>Download File</span>
              </button>
              {fileType === "other" && (
                <button
                  onClick={() => window.open(documentUrl, "_blank")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Open in New Tab
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  // Get file extension for display
  const getFileExtension = () => {
    if (!documentUrl) return "";
    const match = documentUrl.match(/\.([a-zA-Z0-9]+)(?:[?#].*)?$/);
    return match ? match[1].toUpperCase() : "FILE";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                  {getFileExtension()}
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-md">
                {documentName || "Document View"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                {documentUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Download"
              disabled={!documentUrl}
            >
              <FiDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Controls - Only show for images */}
        {fileType === "image" && !loading && !error && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                disabled={scale <= 0.5}
                title="Zoom Out"
              >
                <FiZoomOut size={16} />
                <span>Zoom Out</span>
              </button>
              <span className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                disabled={scale >= 3}
                title="Zoom In"
              >
                <FiZoomIn size={16} />
                <span>Zoom In</span>
              </button>
              <button
                onClick={handleRotate}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center space-x-1"
                title="Rotate 90°"
              >
                <FiRotateCw size={16} />
                <span>Rotate</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                title="Reset View"
              >
                Reset
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rotation: {rotation}°
            </div>
          </div>
        )}

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-2 md:p-4">
          {renderDocumentContent()}
        </div>

        {/* Footer with quick actions */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {fileType && (
                <span className="capitalize">
                  {fileType} document • {getFileExtension()} format
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {documentUrl && (
                <button
                  onClick={() => window.open(documentUrl, "_blank")}
                  className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Open in New Tab
                </button>
              )}
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
              >
                <FiDownload size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
