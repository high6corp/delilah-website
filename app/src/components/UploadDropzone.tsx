import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileVideo } from 'lucide-react';

interface UploadDropzoneProps {
  accept: { [key: string]: string[] };
  maxSize: number;
  onFileSelect: (file: File | null) => void;
  fileType: 'photo' | 'video';
  selectedFile: File | null;
}

export default function UploadDropzone({ accept, maxSize, onFileSelect, fileType, selectedFile }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const Icon = fileType === 'photo' ? FileImage : FileVideo;
  const label = fileType === 'photo' ? 'photo' : 'video';
  const extensions = fileType === 'photo' ? 'JPG, PNG' : 'MP4, MOV';
  const maxSizeMB = maxSize / (1024 * 1024);

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-card min-h-[200px] flex flex-col items-center justify-center
        cursor-pointer transition-all duration-200 p-6
        ${isDragActive
          ? 'border-violet-500 bg-violet-100'
          : selectedFile
            ? 'border-violet-400 bg-violet-50'
            : 'border-violet-300 bg-violet-50 hover:border-violet-500 hover:bg-violet-100'
        }
      `}
    >
      <input {...getInputProps()} />

      {selectedFile ? (
        <div className="text-center">
          <Icon size={40} className="text-violet-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-violet-900 truncate max-w-[250px]">{selectedFile.name}</p>
          <p className="text-xs text-slate-500 mt-1">{formatSize(selectedFile.size)}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
            className="text-xs text-violet-500 hover:text-violet-700 underline mt-2"
          >
            Change file
          </button>
        </div>
      ) : (
        <>
          <Upload size={48} className="text-violet-400 mb-3" />
          <p className="text-sm text-slate-600 text-center">
            Drag a {label} here, or <span className="text-violet-500 font-medium">click to browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1.5">{extensions} up to {maxSizeMB}MB</p>
        </>
      )}
    </div>
  );
}