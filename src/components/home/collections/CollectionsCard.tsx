import React from 'react';
import Image from 'next/image';

interface Collection {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface CollectionsCardProps {
  collection: Collection;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  onClick: () => void;
}

const CollectionsCard: React.FC<CollectionsCardProps> = ({ collection, hoveredCard, setHoveredCard, onClick }) => {
  return (
    <div
      className="relative h-[350px] bg-card rounded-sm overflow-hidden shadow-sm cursor-pointer group"
      onMouseEnter={() => setHoveredCard(collection.id)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={onClick}
    >
      <Image
        src={collection.image}
        alt={collection.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        width={270}
        height={320}
      />
      {hoveredCard === collection.id && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-end p-6 transition-all duration-300">
          <div className="bg-white/10 backdrop-blur-md rounded-sm p-4 w-full border border-white/20">
            <h3 className="text-white font-cormorant font-medium text-lg mb-2">
              {collection.title}
            </h3>
            <p className="text-white/90 text-sm font-inter">
              {collection.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsCard;
