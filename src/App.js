import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch books
  const fetchBooks = useCallback(async (searchQuery) => {
    const url = searchQuery
      ? `https://openlibrary.org/search.json?q=${searchQuery}`
      : `https://openlibrary.org/search.json?q=classic+books`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  }, []);

  // Load defaults (books, history, recents)
  useEffect(() => {
    fetchBooks("");
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(savedHistory);

    const savedRecents = JSON.parse(localStorage.getItem("recentBooks")) || [];
    setRecents(savedRecents);
  }, [fetchBooks]);

  // Persist recents
  useEffect(() => {
    localStorage.setItem("recentBooks", JSON.stringify(recents));
  }, [recents]);

  // Save search to history
  const saveSearchHistory = (term) => {
    if (!term.trim()) return;
    let updated = [term, ...searchHistory.filter((t) => t !== term)];
    updated = updated.slice(0, 10); // limit 10
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // Clear history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchBooks(query);
    saveSearchHistory(query);
    setShowFavorites(false);
    setShowRecents(false);
    setShowHistory(false);
  };

  // Click a history item
  const handleHistoryClick = (term) => {
    setQuery(term);
    fetchBooks(term);
    saveSearchHistory(term);
    setShowFavorites(false);
    setShowRecents(false);
    setShowHistory(false);
  };

  // Remove single history item
  const removeHistoryItem = (termToRemove) => {
    const updatedHistory = searchHistory.filter((term) => term !== termToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Favorites toggle
  const toggleFavorite = (book) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.key === book.key);
      return exists
        ? prev.filter((fav) => fav.key !== book.key)
        : [...prev, book];
    });
  };

  // Recently viewed — add with timestamp
  const handleBookClick = (book) => {
    const withTimestamp = {
      ...book,
      viewedAt: new Date().toISOString(),
    };

    setRecents((prev) => {
      const updated = [
        withTimestamp,
        ...prev.filter((r) => r.key !== book.key),
      ].slice(0, 10);
      return updated;
    });
  };

  // Clear all recents
  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem("recentBooks");
  };

  // Which books to show
  const displayedBooks = showFavorites ? favorites : books;

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Book Finder</h1>
        <form onSubmit={handleSearch} className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search for books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />

            {showHistory && (
              <ul className="history-list">
                {searchHistory.length > 0 ? (
                  <>
                    {searchHistory.map((term, index) => (
                      <li key={index} className="history-item">
                        <span
                          className="history-term"
                          onClick={() => handleHistoryClick(term)}
                        >
                          {term}
                        </span>
                        <span
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(term);
                          }}
                        >
                          ✕
                        </span>
                      </li>
                    ))}
                    <li className="clear-history" onClick={clearHistory}>
                      Clear All History
                    </li>
                  </>
                ) : (
                  <li className="clear-history">No history found</li>
                )}
              </ul>
            )}
          </div>

          <button type="submit">Search</button>

          <button
            type="button"
            className={`favorites-btn ${showFavorites ? "active" : ""}`}
            onClick={() => {
              setShowFavorites((prev) => !prev);
              setShowRecents(false);
            }}
          >
            Favorites ⭐
          </button>

          <button
            type="button"
            className={`recents-btn ${showRecents ? "active" : ""}`}
            onClick={() => {
              setShowRecents((prev) => !prev);
              setShowFavorites(false);
            }}
          >
            Recent 📖
          </button>
        </form>
      </header>

      <main className="results">
        {!showRecents ? (
          displayedBooks.length > 0 ? (
            displayedBooks.map((book) => {
              const isFavorited = favorites.some((fav) => fav.key === book.key);
              return (
                <div
                  key={book.key}
                  className="book-card"
                  onClick={() => handleBookClick(book)}
                >
                  <img
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "https://via.placeholder.com/150x200?text=No+Cover"
                    }
                    alt={book.title}
                    className="book-cover"
                  />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author_name?.join(", ")}</p>
                  </div>
                  <span
                    className={`star-icon ${isFavorited ? "favorited" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(book);
                    }}
                    role="button"
                    aria-label="Add to favorites"
                  >
                    ★
                  </span>
                </div>
              );
            })
          ) : (
            <p>No books found.</p>
          )
        ) : (
          <section className="recents-section">
            <div className="recents-header">
              <h2>📖 Recently Viewed</h2>
              {recents.length > 0 && (
                <button className="clear-recents-btn" onClick={clearRecents}>
                  Clear All
                </button>
              )}
            </div>
            {recents.length > 0 ? (
              <div className="recents-grid">
                {recents.map((book) => (
                  <div key={book.key} className="book-card">
                    <img
                      src={
                        book.cover_i
                          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                          : "https://via.placeholder.com/150x200?text=No+Cover"
                      }
                      alt={book.title}
                      className="book-cover"
                    />
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>{book.author_name?.join(", ")}</p>
                      {book.viewedAt && (
                        <p className="timestamp">
                          Viewed on{" "}
                          {new Date(book.viewedAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent books viewed yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
