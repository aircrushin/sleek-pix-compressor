import { useState, useEffect, useCallback } from "react";
import { Upload, Download, Image as ImageIcon, Moon, Sun, Globe } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

export const ImageCompressor = () => {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [compressionQuality, setCompressionQuality] = useState<number>(0.7);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error(t('toast.error.upload'));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    await compressImage(file);
  };

  const debouncedCompress = useCallback(
    debounce(async (file: File, quality: number) => {
      setIsCompressing(true);
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/jpeg", quality)
        );

        setCompressedSize(blob.size);
        toast.success(t('toast.success.compress'));
      } catch (error) {
        toast.error(t('toast.error.compress'));
        console.error(error);
      } finally {
        setIsCompressing(false);
      }
    }, 500),
    []
  );

  const compressImage = async (file: File) => {
    await debouncedCompress(file, compressionQuality);
  };

  const downloadCompressedImage = async () => {
    if (!image) return;

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      ctx.clearRect(0, 0, img.width, img.height);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      canvas.toBlob((blob) => {
        if (!blob) return;
        link.href = URL.createObjectURL(blob);
        link.download = `compressed_${image.name}`;
        link.click();
        toast.success(t('toast.success.download'));
      }, "image/jpeg", compressionQuality);
    } catch (error) {
      toast.error(t('toast.error.download'));
      console.error(error);
    }
  };

  const handleQualityChange = (quality: number) => {
    setCompressionQuality(quality);
    if (image) {
      debouncedCompress(image, quality);
    }
  };

  return (
    <div className={`h-full ${isDark ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle language"
            >
              <Globe className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
            ${isDark ? 'border-gray-700 hover:border-gray-500 bg-gray-900' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
            relative group`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <Upload className={`w-16 h-16 mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'} group-hover:scale-110`} />
            <div>
              <p className="text-xl font-medium">{t('dropzone.title')}</p>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('dropzone.subtitle')}</p>
            </div>
          </div>
        </div>

        {image && (
          <div className="space-y-6 animate-fade-in">
            <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-black/10 dark:bg-white/10">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{t('sizes.original')}:</span>
                  <span className="font-mono">{(image.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('sizes.compressed')}:</span>
                  <span className="font-mono">{(image.size * compressionQuality / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('sizes.ratio')}:</span>
                  <span className="font-mono">{((1 - compressionQuality) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t('compression.quality')}</span>
                  <span className="text-sm font-mono">
                    {compressionQuality === 0.7 ? t('quality.high') : 
                     compressionQuality === 0.3 ? t('quality.medium') : 
                     t('quality.low')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQualityChange(0.7)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                      ${compressionQuality === 0.7 ? 
                        'bg-blue-500 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {t('quality.high')}
                  </button>
                  <button
                    onClick={() => handleQualityChange(0.3)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                      ${compressionQuality === 0.3 ? 
                        'bg-blue-500 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {t('quality.medium')}
                  </button>
                  <button
                    onClick={() => handleQualityChange(0.1)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                      ${compressionQuality === 0.1 ? 
                        'bg-blue-500 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {t('quality.low')}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={downloadCompressedImage}
              disabled={isCompressing}
              className={`w-full py-4 px-6 rounded-xl font-medium shadow-lg transition-all
                flex items-center justify-center gap-3 disabled:opacity-50
                ${isDark ? 
                  'bg-white text-black hover:bg-gray-100' : 
                  'bg-black text-white hover:bg-gray-900'}`}
            >
              {isCompressing ? (
                t('button.compressing')
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {t('button.download')}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};