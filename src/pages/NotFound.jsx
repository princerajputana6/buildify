import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
