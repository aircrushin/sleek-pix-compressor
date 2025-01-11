import { ImageCompressor } from "@/components/ImageCompressor";

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent gradient-bg">
          Image Compressor
        </h1>
        <p className="text-gray-600">
          Compress your images without losing quality
        </p>
      </div>
      <ImageCompressor />
    </div>
  );
};

export default Index;