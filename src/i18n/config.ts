import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Sleek Pix Compressor',
      dropzone: {
        title: 'Drag and drop your image here',
        subtitle: 'or click to browse',
      },
      sizes: {
        original: 'Original size',
        compressed: 'Compressed size',
        ratio: 'Compression ratio',
      },
      button: {
        compressing: 'Compressing...',
        download: 'Download Compressed Image',
      },
      toast: {
        error: {
          upload: 'Please upload an image file',
          compress: 'Error compressing image',
          download: 'Error downloading image',
        },
        success: {
          compress: 'Image compressed successfully!',
          download: 'Image downloaded successfully!',
        },
      },
      compression: {
        quality: 'Compression Quality'
      },
      quality: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      }
    },
  },
  zh: {
    translation: {
      title: 'Sleek Pix 图片压缩',
      dropzone: {
        title: '拖放图片到这里',
        subtitle: '或点击选择文件',
      },
      sizes: {
        original: '原始大小',
        compressed: '压缩后大小',
        ratio: '压缩比例',
      },
      button: {
        compressing: '压缩中...',
        download: '下载压缩后的图片',
      },
      toast: {
        error: {
          upload: '请上传图片文件',
          compress: '压缩图片时出错',
          download: '下载图片时出错',
        },
        success: {
          compress: '图片压缩成功！',
          download: '图片下载成功！',
        },
      },
      compression: {
        quality: '压缩质量'
      },
      quality: {
        high: '高',
        medium: '中',
        low: '低'
      }
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('zh') ? 'zh' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 