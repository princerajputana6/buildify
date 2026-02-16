import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';

const CategoryNavigation = ({ mobile = false, onLinkClick }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(buildApiUrl(API_ENDPOINTS.CATEGORIES));
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        console.error('Error fetching categories:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="space-y-2">
        {categories.map((category) => {
          const isActive = location.pathname === `/app/products?category=${category.id}`;
          return (
            <Link
              key={category._id}
              to={`/app/products?category=${category.id}`}
              className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-2 ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={onLinkClick}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide pb-2">
      <div className="flex items-center space-x-6 min-w-max px-2">
        {categories.map((category) => {
          const isActive = location.pathname === `/app/products?category=${category.id}`;
          return (
            <Link
              key={category._id}
              to={`/app/products?category=${category.id}`}
              className={`text-sm font-medium transition-colors flex items-center space-x-1 whitespace-nowrap ${
                isActive
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavigation;
