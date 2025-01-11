import { ImageCompressor } from "@/components/ImageCompressor";
import Footer from "@/components/footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <main className="flex-1">
        <ImageCompressor />
      </main>
      <Footer />
    </div>
  );
};

export default Index;