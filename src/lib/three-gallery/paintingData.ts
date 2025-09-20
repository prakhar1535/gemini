export interface PaintingInfo {
  title: string;
  artist: string;
  description: string;
  year: string;
  link?: string;
}

export interface PaintingData {
  imgSrc: string;
  width: number;
  height: number;
  position: { x: number; y: number; z: number };
  rotationY: number;
  info: PaintingInfo;
}

// Default gallery with sample artworks
export const defaultPaintingData: PaintingData[] = [
  // Front Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `/gallery-assets/artworks/${i}.jpg`,
    width: 4,
    height: 3,
    position: { x: -15 + 10 * i, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: `Van Gogh ${i + 1}`,
      artist: "Vincent van Gogh",
      description: `This is one of the masterpieces by Vincent van Gogh, showcasing his unique style and emotional honesty. Artwork ${
        i + 1
      } perfectly encapsulates his love for the beauty of everyday life.`,
      year: `Year ${i + 1}`,
      link: "https://github.com/theringsofsaturn",
    },
  })),
  // Back Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `/gallery-assets/artworks/${i + 4}.jpg`,
    width: 4,
    height: 3,
    position: { x: -15 + 10 * i, y: 2, z: 19.5 },
    rotationY: Math.PI,
    info: {
      title: `Van Gogh ${i + 5}`,
      artist: "Vincent van Gogh",
      description: `Artwork ${
        i + 5
      } by Vincent van Gogh is an exceptional piece showcasing his remarkable ability to capture emotion and atmosphere.`,
      year: `Year ${i + 5}`,
      link: "https://github.com/theringsofsaturn",
    },
  })),
  // Left Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `/gallery-assets/artworks/${i + 8}.jpg`,
    width: 4,
    height: 3,
    position: { x: -19.5, y: 2, z: -15 + 10 * i },
    rotationY: Math.PI / 2,
    info: {
      title: `Van Gogh ${i + 9}`,
      artist: "Vincent van Gogh",
      description: `With its striking use of color and brushwork, Artwork ${
        i + 9
      } is a testament to Van Gogh's artistic genius.`,
      year: `Year ${i + 9}`,
      link: "https://github.com/theringsofsaturn",
    },
  })),
  // Right Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `/gallery-assets/artworks/${i + 12}.jpg`,
    width: 4,
    height: 3,
    position: { x: 19.5, y: 2, z: -15 + 10 * i },
    rotationY: -Math.PI / 2,
    info: {
      title: `Van Gogh ${i + 13}`,
      artist: "Vincent van Gogh",
      description: `Artwork ${
        i + 13
      } is a captivating piece by Vincent van Gogh, reflecting his distinctive style and deep passion for art.`,
      year: `Year ${i + 13}`,
      link: "https://github.com/theringsofsaturn",
    },
  })),
];

// Function to calculate proper dimensions maintaining aspect ratio
function calculatePaintingDimensions(baseWidth: number = 4): {
  width: number;
  height: number;
} {
  // Standard aspect ratios for paintings
  const aspectRatios = [
    { ratio: 4 / 3, name: "4:3" }, // Traditional
    { ratio: 3 / 2, name: "3:2" }, // Classic
    { ratio: 16 / 9, name: "16:9" }, // Wide
    { ratio: 1, name: "1:1" }, // Square
    { ratio: 2 / 3, name: "2:3" }, // Portrait
  ];

  // Randomly select an aspect ratio for variety
  const selectedRatio =
    aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

  return {
    width: baseWidth,
    height: baseWidth / selectedRatio.ratio,
  };
}

// Function to generate painting data from user images
export function generatePaintingDataFromImages(
  images: string[],
  galleryId: string
): PaintingData[] {
  const positions = [
    // Front Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      x: -15 + 10 * i,
      y: 2,
      z: -19.5,
      rotationY: 0,
    })),
    // Back Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      x: -15 + 10 * i,
      y: 2,
      z: 19.5,
      rotationY: Math.PI,
    })),
    // Left Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      x: -19.5,
      y: 2,
      z: -15 + 10 * i,
      rotationY: Math.PI / 2,
    })),
    // Right Wall
    ...Array.from({ length: 4 }, (_, i) => ({
      x: 19.5,
      y: 2,
      z: -15 + 10 * i,
      rotationY: -Math.PI / 2,
    })),
  ];

  return images.map((imageSrc, index) => {
    const position = positions[index % positions.length];
    const dimensions = calculatePaintingDimensions(4); // Base width of 4 units

    return {
      imgSrc: `/gallery-assets/user-galleries/${galleryId}/${imageSrc}`,
      width: dimensions.width,
      height: dimensions.height,
      position,
      rotationY: position.rotationY,
      info: {
        title: `Artwork ${index + 1}`,
        artist: "User Gallery",
        description: `A beautiful piece from your personal gallery collection.`,
        year: new Date().getFullYear().toString(),
      },
    };
  });
}


