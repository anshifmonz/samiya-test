import React from 'react';
import collections from '@/data/collections';
import CollectionsGridClient from './CollectionsGridClient';

// Server function to fetch collections data
async function getCollections() {
  // Simulate API call delay (remove this in real implementation)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return collections;
}

const CollectionsGridServer: React.FC = async () => {
  const collectionsData = await getCollections();

  return <CollectionsGridClient collections={collectionsData} />;
};

export default CollectionsGridServer;
