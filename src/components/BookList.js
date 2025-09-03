import React from "react";
import BookCard from "./BookCard";

function BookList({ books, favorites, toggleFavorite }) {
  if (!books || books.length === 0) {
    return <p>No books to display.</p>;
  }

  return (
    <div className="book-list">
      {books.map((book, index) => (
        <BookCard
          key={index}
          book={book}
          isFavorite={favorites.some((fav) => fav.key === book.key)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}

export default BookList;
