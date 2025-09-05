// src/pages/Browse.jsx
import React from 'react';
import Loading from '../pages/Loading';
import BookCard from '../components/Cards/BookCard';
import { useBooks, useInventory , useAuthors, useStores } from '../hooks';

const BrowseBooks = () => {
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory();
  const { authorMap} = useAuthors();
  const {  storeMap } = useStores();

  const isLoading = booksLoading || inventoryLoading;
  const error = booksError || inventoryError;
  
  const booksWithStores = React.useMemo(() => {
    return books.map((book) => {
      const bookInventory = inventory.filter((item) => item.book_id === book.id);
      const bookStores = bookInventory.map((item) => ({
        name: storeMap[item.store_id]?.name || 'Unknown Store',
        price: item.price,
      }));

      return {
        title: book.name,
        author: authorMap[book.author_id]?.name || 'Unknown Author',
        stores: bookStores,
      };
    });
  }, [books, inventory, authorMap, storeMap]);

  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return <div className="py-6 px-4">Error loading data: {error}</div>;
  }

return (
    <div className="py-6 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse All Books</h2>
        <div className="flex flex-wrap gap-6 ">
            {booksWithStores.map((book, index) => (
                <BookCard
                    key={index}
                    title={book.title}
                    author={book.author}
                    stores={book.stores}
                />
            ))}
        </div>
    </div>
);
};

export default BrowseBooks;