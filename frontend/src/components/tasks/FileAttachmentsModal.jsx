import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Download, Trash2, File, Image as ImageIcon, Eye } from 'lucide-react';
import { api } from '../../api/api.js';

export default function FileAttachmentsModal({ task, onClose }) {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAttachments();
  }, [task.id]);

  const fetchAttachments = async () => {
    try {
      const data = await api.getTaskAttachments(task.id);
      setAttachments(data);
    } catch (err) {
      console.error('Error fetching attachments:', err);
    }
  };

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const uploadedBy = currentUser.email || 'Unknown';

    for (let file of files) {
      await uploadFile(file, uploadedBy);
    }
  };

  const uploadFile = async (file, uploadedBy) => {
    setUploading(true);
    try {
      const result = await api.uploadFileToTask(task.id, file, uploadedBy);
      setAttachments(prev => [...prev, result]);
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert(`Failed to upload "${file.name}"`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId, fileName) => {
    if (!confirm(`Delete "${fileName}"?`)) return;

    try {
      await api.deleteAttachment(attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      console.error('Error deleting attachment:', err);
      alert('Failed to delete attachment');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (attachment) => {
    if (attachment.isImage) {
      return <ImageIcon size={24} className="text-blue-600" />;
    }
    return <File size={24} className="text-gray-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">File Attachments</h2>
            <p className="text-gray-600 mt-1">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-6 border-b bg-gray-50">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 10MB. Supported: Images, PDFs, Documents
          </p>
        </div>

        {/* Attachments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {attachments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <File size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No attachments yet</p>
              <p className="text-sm">Upload files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(attachment)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate" title={attachment.fileName}>
                        {attachment.fileName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(attachment.fileSize)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {attachment.uploadedBy || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(attachment.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {attachment.isImage && (
                    <div className="mt-3">
                      <img
                        src={api.previewAttachment(attachment.id)}
                        alt={attachment.fileName}
                        className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedImage(attachment)}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {attachment.isImage && (
                      <button
                        onClick={() => setSelectedImage(attachment)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    )}
                    <a
                      href={api.downloadAttachment(attachment.id)}
                      download
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
                    >
                      <Download size={16} />
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(attachment.id, attachment.fileName)}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            <img
              src={api.previewAttachment(selectedImage.id)}
              alt={selectedImage.fileName}
              className="max-w-full max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
              <p className="font-semibold">{selectedImage.fileName}</p>
              <p className="text-sm text-gray-600">{formatFileSize(selectedImage.fileSize)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}