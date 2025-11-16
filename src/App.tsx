import { useState, useRef } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      setProcessedImage(null);

      setIsProcessing(true);
      try {
        const blob = await removeBackground(imageUrl);
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
      } catch (error) {
        console.error('Error removing background:', error);
        alert('Failed to remove background. Please try another image.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className="w-12 h-12 text-slate-700" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-3">Background Remover</h1>
          <p className="text-lg text-slate-600">Remove backgrounds from your images instantly</p>
        </div>

        {!originalImage ? (
          <div className="max-w-2xl mx-auto">
            <div
              className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-slate-500 bg-slate-50'
                  : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-6 text-slate-400" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Upload an image</h3>
              <p className="text-slate-600 mb-6">Drag and drop your image here, or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Choose Image
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Original</h3>
                </div>
                <div className="p-6 bg-slate-50">
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                    <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Background Removed</h3>
                </div>
                <div className="p-6 bg-slate-50">
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden shadow-sm"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  >
                    {isProcessing ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 mx-auto mb-4 text-slate-700 animate-spin" />
                          <p className="text-slate-700 font-medium">Processing image...</p>
                          <p className="text-sm text-slate-500 mt-1">This may take a few moments</p>
                        </div>
                      </div>
                    ) : processedImage ? (
                      <img src={processedImage} alt="Processed" className="w-full h-full object-contain" />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleDownload}
                disabled={!processedImage || isProcessing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Download Result
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-medium border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Upload New Image
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How it works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-700">1</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Upload Image</h3>
                <p className="text-slate-600">Choose any image from your device</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-700">2</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Processing</h3>
                <p className="text-slate-600">Automatically removes the background</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-700">3</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Download</h3>
                <p className="text-slate-600">Get your image with a transparent background</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
