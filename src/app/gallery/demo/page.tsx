import ThreeGallery from '@/lib/three-gallery/ThreeGallery';
import { defaultPaintingData } from '@/lib/three-gallery/paintingData';

export default function DemoGalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Demo 3D Gallery</h1>
              <p className="text-gray-300">Experience the immersive 3D art gallery</p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <ThreeGallery paintingData={defaultPaintingData} galleryId="demo" />
    </div>
  );
}

export const metadata = {
  title: 'Demo 3D Gallery - SocialFlow',
  description: 'Experience our immersive 3D art gallery',
};



