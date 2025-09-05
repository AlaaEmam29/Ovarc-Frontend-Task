// src/pages/StoreInventory.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header';
import InventoryHeader from '../components/InventoryHeader';
import BooksTable from '../components/BooksTable';
import BookDropdown from '../components/BookDropdown';
import useInventory from '../hooks/useInventory';
import useBooks from '../hooks/useBooks';
import useAuthors from '../hooks/useAuthors';
import useStores from '../hooks/useStores';
import { useAuth } from '../hooks';
import LoginModal from '../components/LoginModal';

const StoreInventory = () => {
  // Get store ID from URL params
  const { storeId } = useParams();
  
  // State for UI
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get authentication state
  const { isAuthenticated } = useAuth();

  // Hooks for data
  const { storeInventory, loading, error, getStoreInventory, addItem, updateItem, deleteItem } = useInventory();
  const { books } = useBooks();
  const { authors , getAuthors , authorMap } = useAuthors();
  const { currentStore, getStoreById } = useStores();
  
  // Set active tab based on view query param
  const view = 'books';
  useEffect(() => {
    if (view === 'authors' || view === 'books') {
      setActiveTab(view);
    }
  }, [view]);
  
  // Fetch store data when component mounts
  useEffect(() => {
    if (storeId) {
      getStoreById(storeId);
      getStoreInventory(storeId);
    }
  }, [storeId, getStoreById, getStoreInventory]);

  useEffect(() => {
    getAuthors();
  }, [getAuthors]);


  // Modal controls
  const openModal = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedBookId('');
    setBookPrice('');
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedBookId('');
    setBookPrice('');
  };
  
  // Handle adding a book to inventory
  const handleAddToInventory = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!selectedBookId || !bookPrice) {
      alert('Please select a book and enter a price.');
      return;
    }

    // Validate price
    const priceValue = parseFloat(bookPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price greater than 0.');
      return;
    }

    // Check if book is already in store inventory
    const existingItem = storeInventory.find(item => item.book_id === parseInt(selectedBookId));
    if (existingItem) {
      alert('This book is already in the store inventory.');
      return;
    }
    
    try {
      const newInventoryItem = {
        store_id: parseInt(storeId, 10),
        book_id: parseInt(selectedBookId, 10),
        price: priceValue
      };
      
      await addItem(newInventoryItem);
      // Refresh inventory after adding
      getStoreInventory(storeId);
      closeModal();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add book to inventory. Please try again.');
    }
  };
  
  // Handle deleting a book from inventory
  const handleDeleteFromInventory = async (inventoryItemId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    if (!confirm('Are you sure you want to remove this book from the store inventory?')) {
      return;
    }
    
    try {
      await deleteItem(inventoryItemId, storeId);
      // Refresh inventory after deletion
      getStoreInventory(storeId);
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };
  
  // Handle updating book price
  const handleUpdatePrice = async (inventoryItemId, newPrice) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      await updateItem(inventoryItemId, { price: parseFloat(newPrice) }, storeId);
      setEditingRowId(null);
      setEditPrice('');
      // Refresh inventory after update
      getStoreInventory(storeId);
    } catch (err) {
      console.error('Error updating price:', err);
      alert('Failed to update price. Please try again.');
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditPrice('');
  };

  // Filter inventory based on search term
  const filteredInventory = storeInventory.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const book = books.find(b => b.id === item.book_id);
    const author = authors.find(a => a.id === book?.author_id);
    const authorName = author ? `${author.first_name} ${author.last_name}` : '';
    
    const searchLower = searchTerm.toLowerCase();
    return (
      book?.name?.toLowerCase().includes(searchLower) ||
      authorName.toLowerCase().includes(searchLower) ||
      book?.id?.toString().includes(searchLower) ||
      item.price?.toString().includes(searchLower)
    );
  });

  return (
    <div className="py-6">
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Authors
        </button>
      </div>

      <InventoryHeader 
        title={`${currentStore?.name || 'Store'} Inventory`} 
        buttonTitle="Add to inventory"
        onAddNew={openModal}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {loading ? (
        <p className="text-gray-600">Loading inventory data...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : activeTab === 'books' ? (
        filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <BooksTable
              books={filteredInventory.map(item => {
                const book = books.find(b => b.id === item.book_id) || {};
                return {
                  ...book,
                  inventory_id: item.id,
                  price: item.price
                };
              })}
              authors={authors}
              editingRowId={editingRowId}
              setEditingRowId={setEditingRowId}
              editName={editPrice}
              setEditName={setEditPrice}
              setBooks={(updatedBooks) => {
                const updatedBook = updatedBooks.find(b => b.id === editingRowId);
                if (updatedBook) {
                  handleUpdatePrice(updatedBook.inventory_id, editPrice);
                }
              }}
              deleteBook={(bookId, bookName) => {
                const inventoryItem = filteredInventory.find(item => item.book_id === bookId);
                if (inventoryItem) {
                  handleDeleteFromInventory(inventoryItem.id);
                }
              }}
              columnsConfig={['id', 'name', 'pages', 'author', 'price', 'actions']}
            />
          </div>
        ) : searchTerm ? (
          <p className="text-gray-600">No books found matching "{searchTerm}".</p>
        ) : (
          <p className="text-gray-600">No books found in this store.</p>
        )
      ) : (
        <p className="text-gray-600">No authors with books in this store.</p>
      )}

      <Modal
        title="Add Book to Store Inventory"
        save={handleAddToInventory}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
        disabled={!selectedBookId || !bookPrice}
      >
        <div className="flex flex-col gap-4 w-full">          <BookDropdown
            books={books}
            selectedBookId={selectedBookId}
            onBookSelect={setSelectedBookId}
            excludeBookIds={storeInventory.map(item => item.book_id)}
            maxInitialItems={7}
          />

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
              value={bookPrice}
              onChange={(e) => setBookPrice(e.target.value)}
            />
          </div>
          
        </div>
      </Modal>
    </div>
  );
};

export default StoreInventory;

