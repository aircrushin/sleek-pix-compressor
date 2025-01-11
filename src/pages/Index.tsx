import { ImageCompressor } from "@/components/ImageCompressor";

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-200">
          Image Compressor
        </h1>
        <p className="text-gray-400">
          Compress your images without losing quality
        </p>
      </div>
      <ImageCompressor />
    </div>
  );
};

export default Index;