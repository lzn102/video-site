import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function UploadForm({ onFileUpload, fileType, buttonText }) {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert(language === 'zh' ? '请选择一个文件' : 'Please select a file');
      return;
    }
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append(fileType, file);
    
    try {
      await onFileUpload(formData);
    } catch (error) {
      console.error(language === 'zh' ? '上传失败:' : 'Upload failed:', error);
      alert(language === 'zh' ? '上传失败，请重试' : 'Upload failed, please try again');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="file-input-container">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept={fileType === 'video' ? 'video/*' : fileType === 'audio' ? 'audio/*' : '.srt,.vtt'} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-outline-none focus-ring-2 focus-ring-blue-500 focus-border-blue-500"
        />
        {file && <p className="mt-1 text-sm text-gray-500">{language === 'zh' ? '已选择文件:' : 'Selected file:'} {file.name}</p>}
      </div>
      
      <button 
        type="submit" 
        disabled={isUploading || !file}
        className="btn-primary"
      >
        {isUploading ? (language === 'zh' ? '处理中... ⏳' : 'Processing... ⏳') : buttonText}
      </button>
    </form>
  );
}