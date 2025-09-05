// src/pages/StoreInventory.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BooksTable from '../components/BooksTable';
import useInventory from '../hooks/useInventory';
import useBooks from '../hooks/useBooks';
import useAuthors from '../hooks/useAuthors';
import useStores from '../hooks/useStores';

const StoreInventory = () => {
  // Get store ID from URL params
  const { storeId } = useParams();
  
  // State for UI
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Hooks for data
  const { storeInventory, loading, error, getStoreInventory, addItem, updateItem, deleteItem } = useInventory();
  const { books } = useBooks();
  const { authors } = useAuthors();
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
  


  // Modal controls
  const openModal = () => {
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
    if (!selectedBookId || !bookPrice) {
      return;
    }
    
    try {
      const newInventoryItem = {
        store_id: parseInt(storeId, 10),
        book_id: parseInt(selectedBookId, 10),
        price: parseFloat(bookPrice)
      };
      
      await addItem(newInventoryItem);
      closeModal();
    } catch (err) {
      // Error is handled by the reducer
    }
  };
  
  // Handle deleting a book from inventory
  const handleDeleteFromInventory = async (inventoryItemId) => {
    try {
      await deleteItem(inventoryItemId, storeId);
    } catch (err) {
      // Error is handled by the reducer
    }
  };
  
  // Handle updating book price
  const handleUpdatePrice = async (inventoryItemId, newPrice) => {
    try {
      await updateItem(inventoryItemId, { price: parseFloat(newPrice) }, storeId);
      setEditingRowId(null);
      setEditPrice('');
    } catch (err) {
      // Error is handled by the reducer
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditPrice('');
  };

  return (
    <div className="py-6">
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

      <Header 
        addNew={openModal} 
        title={`${currentStore?.name || 'Store'} Inventory`} 
        buttonTitle="Add to inventory" 
      />

      {loading ? (
        <p className="text-gray-600">Loading inventory data...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : activeTab === 'books' ? (
        storeInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <BooksTable
              books={storeInventory.map(item => {
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
                const inventoryItem = storeInventory.find(item => item.book_id === bookId);
                if (inventoryItem) {
                  handleDeleteFromInventory(inventoryItem.id);
                }
              }}
              columnsConfig={['id', 'name', 'pages', 'author', 'price', 'actions']}
            />
          </div>
        ) : (
          <p className="text-gray-600">No books found in this store.</p>
        )
      ) : (
        <p className="text-gray-600">No authors with books in this store.</p>
      )}

      <Modal
        title="Add/Edit Book in Store"
        save={handleAddToInventory}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
        disabled={!selectedBookId || !bookPrice}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              className="border border-gray-300 rounded p-2 w-full"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
            >
              <option value="">-- Select a book --</option>
              {books
                .filter(book => !storeInventory.some(item => item.book_id === book.id))
                .map(book => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="text"
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