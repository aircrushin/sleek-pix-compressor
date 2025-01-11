import { useState } from "react";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const ImageCompressor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Please upload an image file");
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

  const compressImage = async (file: File) => {
    setIsCompressing(true);
    try {
      // Create a canvas element
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Calculate new dimensions (maintaining aspect ratio)
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

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.7)
      );

      setCompressedSize(blob.size);
      toast.success("Image compressed successfully!");
    } catch (error) {
      toast.error("Error compressing image");
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressedImage = async () => {
    if (!image) return;

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      canvas.toBlob((blob) => {
        if (!blob) return;
        link.href = URL.createObjectURL(blob);
        link.download = `compressed_${image.name}`;
        link.click();
        toast.success("Image downloaded successfully!");
      }, "image/jpeg", 0.7);
    } catch (error) {
      toast.error("Error downloading image");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-400 relative bg-secondary/50"
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
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            <p className="text-xl font-medium text-gray-200">
              Drag and drop your image here
            </p>
            <p className="text-sm text-gray-400 mt-2">or click to browse</p>
          </div>
        </div>
      </div>

      {image && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-secondary/50 rounded-lg shadow-xl p-6 border border-gray-700">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-black/30">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
            </div>
            <div className="mt-4 space-y-2 text-gray-300">
              <div className="flex justify-between text-sm">
                <span>Original size:</span>
                <span>{(image.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Compressed size:</span>
                <span>{(compressedSize / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Compression ratio:</span>
                <span>
                  {((1 - compressedSize / image.size) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={downloadCompressedImage}
            disabled={isCompressing}
            className="w-full py-3 px-4 rounded-lg text-gray-200 font-medium shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 bg-secondary hover:bg-secondary/80"
          >
            {isCompressing ? (
              "Compressing..."
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Compressed Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};