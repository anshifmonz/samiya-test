import React from 'react';

interface AddImageDialogProps {
  show: boolean;
  onClose: () => void;
  addImageTab: 'url' | 'device';
  setAddImageTab: (tab: 'url' | 'device') => void;
  newImageUrl: string;
  setNewImageUrl: (v: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (f: File[] | ((prev: File[]) => File[])) => void;
  uploading: boolean;
  uploadError: string | null;
  uploadProgress: { [filename: string]: number };
  setUploadProgress: React.Dispatch<React.SetStateAction<{ [filename: string]: number }>>;
  uploadStatus: { [filename: string]: 'pending' | 'uploading' | 'success' | 'error' };
  setUploadStatus: React.Dispatch<React.SetStateAction<{ [filename: string]: 'pending' | 'uploading' | 'success' | 'error' }>>;
  uploadErrors: { [filename: string]: string };
  setUploadErrors: React.Dispatch<React.SetStateAction<{ [filename: string]: string }>>;
  onAddImage: () => void;
  selectedColorForImage: string;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({
  show, onClose, addImageTab, setAddImageTab, newImageUrl, setNewImageUrl, selectedFiles, setSelectedFiles, uploading, uploadError, uploadProgress, setUploadProgress, uploadStatus, setUploadStatus, uploadErrors, setUploadErrors, onAddImage, selectedColorForImage
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <h3 className="luxury-heading text-xl text-luxury-black mb-4">
          Add Image to {selectedColorForImage}
        </h3>
        <div className="flex mb-4 gap-2">
          <button
            type="button"
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${addImageTab === 'device' ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-cream/50 text-luxury-gray hover:bg-luxury-cream'}`}
            onClick={() => setAddImageTab('device')}
          >
            From Device
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${addImageTab === 'url' ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-cream/50 text-luxury-gray hover:bg-luxury-cream'}`}
            onClick={() => setAddImageTab('url')}
          >
            From URL
          </button>
        </div>
        {addImageTab === 'url' && (
          <input
            type="url"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 mb-4"
            autoFocus
          />
        )}
        {addImageTab === 'device' && (
          <div className="flex flex-col gap-2">
            <div
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-luxury-gray/30 rounded-xl bg-luxury-cream/50 p-4 mb-4 cursor-pointer hover:bg-luxury-cream/80 transition-all duration-200"
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDragEnter={e => { e.preventDefault(); e.stopPropagation(); }}
              onDragLeave={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                if (files.length > 0) {
                  setSelectedFiles(prev => [...prev, ...files]);
                }
              }}
              onClick={() => {
                document.getElementById('product-image-file-input')?.click();
              }}
              style={{ minHeight: 100 }}
            >
              <input
                id="product-image-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple={true}
                className="hidden"
                onChange={e => {
                  if (e.target.files) {
                    setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
                  }
                }}
              />
              <span className="text-luxury-gray text-sm">Click or drag & drop to select image(s)</span>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mb-4 w-full max-h-[40vh] overflow-y-auto flex flex-wrap items-center gap-4 justify-center pr-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex flex-col items-center w-32">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-32 h-32 object-cover rounded-xl border border-luxury-gray/20 mb-2"
                    />
                    <span className="text-xs text-luxury-gray break-all text-center">{file.name}</span>
                    {uploading && uploadProgress[file.name] !== undefined && uploadStatus[file.name] === 'uploading' && (
                      <div className="w-full h-2 bg-luxury-gray/20 rounded mt-2">
                        <div
                          className="h-2 bg-luxury-gold rounded transition-all duration-200"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                    {uploadStatus[file.name] === 'success' && (
                      <div className="w-full text-green-600 text-xs mt-2 text-center">Uploaded</div>
                    )}
                    {uploadStatus[file.name] === 'error' && (
                      <div className="w-full text-red-600 text-xs mt-2 text-center">
                        Failed: {uploadErrors[file.name] || 'Upload failed.'}
                        <button
                          type="button"
                          className="block mt-1 text-xs underline text-luxury-gold hover:text-luxury-gold-dark"
                          onClick={async () => {
                            // retry upload for this file
                            setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
                            setUploadErrors(prev => ({ ...prev, [file.name]: '' }));
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const uploadPromise = new Promise<string>((resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', '/api/admin/upload');
                                xhr.upload.onprogress = (event) => {
                                  if (event.lengthComputable) {
                                    setUploadProgress(prev => ({ ...prev, [file.name]: Math.round((event.loaded / event.total) * 100) }));
                                  }
                                };
                                xhr.onload = () => {
                                  if (xhr.status >= 200 && xhr.status < 300) {
                                    const data = JSON.parse(xhr.responseText);
                                    resolve(data.secure_url);
                                  } else {
                                    const data = JSON.parse(xhr.responseText);
                                    reject(new Error(data.error || 'Upload failed'));
                                  }
                                };
                                xhr.onerror = () => reject(new Error('Upload failed'));
                                xhr.send(formData);
                              });
                              await uploadPromise;
                              setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
                            } catch (err: any) {
                              setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
                              setUploadErrors(prev => ({ ...prev, [file.name]: err.message || 'Upload failed.' }));
                            }
                          }}
                          disabled={uploading && uploadStatus[file.name] === 'uploading'}
                        >Retry</button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-xs mt-1"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                      disabled={uploading && uploadStatus[file.name] === 'uploading'}
                    >Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3 mt-2 pt-2 border-t border-luxury-gray/10 bg-white sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAddImage}
            className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-xl hover:bg-luxury-gold-light transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={uploading || (addImageTab === 'device' && !selectedFiles.length)}
          >
            {uploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>
        {uploadError && <div className="text-red-600 text-xs mt-2 text-center">{uploadError}</div>}
      </div>
    </div>
  );
};

export default AddImageDialog;
