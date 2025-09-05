// src/components/InventoryHeader.jsx
import React from 'react';
import searchIcon from '../assets/search.png';

const InventoryHeader = ({ 
  title, 
  buttonTitle, 
  onAddNew, 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className='flex justify-between items-center mb-4'>
      <div className='flex items-center gap-4'>
        <h1 className='text-lg font-semibold'>{title || 'Inventory'}</h1>
        
        {/* Custom search bar for inventory */}
        <div className="flex items-center rounded py-1.5 px-3 bg-white border border-gray-300">
          <img src={searchIcon} alt="Search" className="w-4 h-4 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search books, authors, or prices..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>
      
      <button 
        className='bg-main text-white rounded px-4 py-2 hover:bg-opacity-90 transition-colors'
        onClick={onAddNew}
      >
        {buttonTitle || 'Add New'}
      </button>
    </div>
  );
};

export default InventoryHeader;

