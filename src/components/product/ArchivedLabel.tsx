import React from 'react';

const ArchivedLabel = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Currently unavailable</p>
      <p>This product is currently not available for purchase.</p>
    </div>
  );
};

export default ArchivedLabel;
