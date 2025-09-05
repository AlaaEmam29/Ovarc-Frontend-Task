// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../pages/Loading';
import StoreCard from '../components/Cards/StoreCard';
import BookCard from '../components/Cards/BookCard';
import AuthorCard from '../components/Cards/AuthorCard';
import { useBooks, useAuthors, useStores, useInventory } from '../hooks';

const Home = () => {
  const { books, loading: booksLoading, error: booksError ,} = useBooks();
  const { authors, loading: authorsLoading, error: authorsError ,authorMap} = useAuthors();
  const { stores, loading: storesLoading, error: storesError , storeMap } = useStores();
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory();
  
  const isLoading = booksLoading || authorsLoading || storesLoading || inventoryLoading;
  const error = booksError || authorsError || storesError || inventoryError;
  
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
  
  const storesWithMetrics = React.useMemo(() => {
    return stores.slice(0, 5).map((store) => { 
      const storeInventory = inventory.filter(
        (item) => item.store_id === store.id
      );
      const noOfBooks = storeInventory.length;
      const totalPrice = storeInventory.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = noOfBooks > 0 ? totalPrice / noOfBooks : 0;

      return {
        name: store.name,
        noOfBooks,
        averagePrice,
      };
    });
  }, [stores, inventory]);

  const limitedBooksWithStores = booksWithStores.slice(0, 5);

  const authorsWithBookCount = React.useMemo(() => {
    return authors.slice(0, 5).map((author) => { 
      const noOfBooks = books.filter((book) => book.author_id === author.id).length;
      return {
        name: `${author.first_name} ${author.last_name}`,
        noOfBooks,
      };
    });
  }, [authors, books]);

  if (isLoading) {
    return <Loading />;
  }
  
  if (error) {
    return <div className="py-6 px-4">Error loading data: {error}</div>;
  }

  return (
    <div className="py-6 px-4">
      {/* Stores Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Stores</h2>
          <Link 
            to="/browsestores" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {storesWithMetrics.map((store, index) => (
            <div key={index} className="flex-shrink-0">
              <StoreCard
                name={store.name}
                noOfBooks={store.noOfBooks}
                averagePrice={store.averagePrice}
                id={store.id}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Books</h2>
          <Link 
            to="/browsebooks" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {limitedBooksWithStores.map((book, index) => (
            <div key={index} className="flex-shrink-0">
              <BookCard
                title={book.title}
                author={book.author}
                stores={book.stores}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Authors Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Authors</h2>
          <Link 
            to="/browseauthors" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {authorsWithBookCount.map((author, index) => (
            <div key={index} className="flex-shrink-0">
              <AuthorCard
                name={author.name}
                noOfBooks={author.noOfBooks}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;