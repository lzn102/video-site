import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function UploadForm({ onFileUpload, fileType, buttonText, showPreview = false }) {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // 清理函数，在组件卸载时释放预览URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // 清理之前的预览URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // 如果需要预览且是视频文件，则创建预览URL
    if (showPreview && selectedFile && fileType === 'video' && selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
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

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    
    // 清理预览URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // 重置文件输入框
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form id="upload-form-container-1" onSubmit={handleSubmit} className="upload-form">
      {showPreview && fileType === 'video' ? (
        // 大尺寸方形上传区域，带预览功能
        <div className="flex flex-col items-center">
          <div 
            id="video-upload-preview-container-1"
            className="w-80 h-80 border-2 border-gray-800 rounded-xl flex flex-col items-center justify-center relative shadow-lg hover:border-gray-900 transition-all duration-300 hover:shadow-xl"
          >
            {previewUrl ? (
              <div className="w-full h-full flex items-center justify-center rounded-lg bg-black">
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className="w-full h-full object-contain rounded-lg"
                  controls={true}
                  autoPlay={false}
                  muted={true}
                  playsInline={true}
                />
              </div>
            ) : (
              <>
                <div className="text-5xl mb-4 text-blue-500 animate-bounce">📹</div>
                <p className="text-gray-700 text-center px-4 font-medium">
                  {language === 'zh' ? '点击下方按钮上传视频文件' : 'Click the button below to upload video file'}
                </p>
                <p className="text-gray-500 text-sm mt-2 text-center px-4">
                  {language === 'zh' ? '支持 MP4, MOV, AVI 等格式' : 'Supports MP4, MOV, AVI and other formats'}
                </p>
              </>
            )}
            <input 
              ref={fileInputRef}
              id="upload-form-file-input-1"
              type="file" 
              onChange={handleFileChange} 
              accept="video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            />
          </div>
          
          <div id="upload-form-buttons-container-1" className="flex flex-col items-center mt-6 w-full justify-between flex-row">
            <div id="upload-form-buttons-wrapper-1" className="flex space-x-4 w-full justify-between">
              <button
                type="button"
                onClick={triggerFileSelect}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm min-w-[100px]"
              >
                {language === 'zh' ? '上传文件' : 'Upload File'}
              </button>
              {file && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm min-w-[100px]"
                >
                  {language === 'zh' ? '清除文件' : 'Clear File'}
                </button>
              )}
            </div>
            {file && (
              <p id="upload-form-selected-file-1" className="mt-3 text-sm text-gray-500 text-center">
                {language === 'zh' ? '已选择文件:' : 'Selected file:'} {file.name}
              </p>
            )}
          </div>
        </div>
      ) : (
        // 默认上传区域
        <div id="upload-form-file-input-container-1" className="file-input-container w-4/5">
          <input 
            ref={fileInputRef}
            id="upload-form-file-input-1"
            type="file" 
            onChange={handleFileChange} 
            accept={fileType === 'video' ? 'video/*' : fileType === 'audio' ? 'audio/*' : '.srt,.vtt'} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-outline-none focus-ring-2 focus-ring-blue-500 focus-border-blue-500"
          />
          {file && <p id="upload-form-selected-file-1" className="mt-1 text-sm text-gray-500">{language === 'zh' ? '已选择文件:' : 'Selected file:'} {file.name}</p>}
        </div>
      )}
      
      <button 
        id="upload-form-submit-button-1"
        type="submit" 
        disabled={isUploading || !file}
        className="btn-primary w-full mt-8"
      >
        {isUploading ? (language === 'zh' ? '处理中... ⏳' : 'Processing... ⏳') : buttonText}
      </button>
    </form>
  );
}