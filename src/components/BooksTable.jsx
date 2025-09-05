// src/components/BooksTable.jsx
import React, { useMemo } from 'react';
import Table from './Table/Table';
import TableActions from './ActionButton/TableActions';

const BooksTable = ({
  books,
  authors,
  editingRowId,
  setEditingRowId,
  editName,
  setEditName,
  setBooks,
  deleteBook,
  columnsConfig = ['id', 'name', 'pages', 'author', 'actions'], // Default columns
}) => {
  // Create a lookup map for authors
  // Enrich books with author names
  const enrichedBooks = useMemo(() => {
    return books.map((book) => {
      const author = authors.find(a => a.id === book.author_id);
      return {
        ...book,
        author_name: author ? `${author.first_name} ${author.last_name}` : 'Unknown Author',
      };
    });
  }, [books, authors]);

  // Define all possible columns
  const allColumns = useMemo(
    () => ({
      id: { header: 'Book Id', accessorKey: 'id' },
      name: { header: 'Name', accessorKey: 'name' },
      pages: { header: 'Pages', accessorKey: 'page_count' },
      author: { header: 'Author', accessorKey: 'author_name' },
      price: { 
        header: 'Price', 
        accessorKey: 'price',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(row.original.id);
                if (e.key === 'Escape') handleCancel();
              }}
              className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            `$${parseFloat(row.original.price).toFixed(2)}`
          ),
      },
      actions: {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={
              editingRowId === row.original.id
                ? handleCancel
                : () => handleEdit(row.original)
            }
            onDelete={() => deleteBook(row.original.id, row.original.name)}
          />
        ),
      },
    }),
    [editingRowId, editName, deleteBook]
  );

  // Select columns based on columnsConfig
  const columns = useMemo(() => {
    return columnsConfig.map((colKey) => allColumns[colKey]).filter(Boolean);
  }, [columnsConfig, allColumns]);

  // Handle editing price
  const handleEdit = (book) => {
    setEditingRowId(book.id);
    setEditName(book.price ? book.price.toString() : '');
  };

  // Save edited price
  const handleSave = (id) => {
    // Validate price is a valid number
    const priceValue = parseFloat(editName);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }
    
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, price: priceValue } : book
      )
    );
    setEditingRowId(null);
    setEditName('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRowId(null);
    setEditName('');
  };

  return <Table data={enrichedBooks} columns={columns} />;
};

export default BooksTable;