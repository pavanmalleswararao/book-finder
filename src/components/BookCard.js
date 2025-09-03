import React from "react";

function BookCard({ book, isFavorite, toggleFavorite }) {
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="book-card">
      <button
        className={`star-btn ${isFavorite ? "favorited" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering "recent" when toggling favorite
          toggleFavorite(book);
        }}
        aria-label="Toggle Favorite"
      >
        ⭐
      </button>
      <img src={coverUrl} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author_name ? book.author_name.join(", ") : "Unknown Author"}</p>
      <p>{book.first_publish_year ? book.first_publish_year : "N/A"}</p>
    </div>
  );
}

export default BookCard;
