import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const MIN_SUGGESTION_LEN = 2; // show suggestions when query length >= this

const App = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Suggestions + focus/hover state
  const [suggestions, setSuggestions] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // hover over search area

  // Fetch books
  const fetchBooks = useCallback(async (searchQuery) => {
    const url = searchQuery
      ? `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`
      : `https://openlibrary.org/search.json?q=classic+books`;

    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
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

  // Fetch suggestions when typing (debounced)
  useEffect(() => {
    if (query.length < MIN_SUGGESTION_LEN) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=6`
        );
        const data = await res.json();
        const titles = [...new Set(data.docs.map((b) => b.title).filter(Boolean))].slice(0, 6);
        setSuggestions(titles);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Save search to history
  const saveSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    let updated = [term, ...searchHistory.filter((t) => t !== term)];
    updated = updated.slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // Clear history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchBooks(query);
    saveSearchHistory(query);
    setShowFavorites(false);
    setShowRecents(false);
    setSuggestions([]);
    setInputFocused(false);
    setIsHovered(false);
  };

  // Handle selecting a suggestion (use onMouseDown so handler runs before blur)
  const handleSuggestionSelect = (title) => {
    // Update query, run search and keep dropdown visible so user can click more
    setQuery(title);
    fetchBooks(title);
    saveSearchHistory(title);
    setInputFocused(true);
  };

  // Click a history item
  const handleHistoryClick = (term) => {
    setQuery(term);
    fetchBooks(term);
    saveSearchHistory(term);
    setInputFocused(true);
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
      return exists ? prev.filter((fav) => fav.key !== book.key) : [...prev, book];
    });
  };

  // Recently viewed — add with timestamp
  const handleBookClick = (book) => {
    const withTimestamp = {
      ...book,
      viewedAt: new Date().toISOString(),
    };

    setRecents((prev) => {
      const updated = [withTimestamp, ...prev.filter((r) => r.key !== book.key)].slice(0, 10);
      return updated;
    });
  };

  // Clear all recents
  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem("recentBooks");
  };

  // Reset to Home — CLEAR search box + suggestions/history overlays
  const handleHomeClick = () => {
    setShowFavorites(false);
    setShowRecents(false);
    fetchBooks("");
    // Clear search input and hide dropdowns
    setQuery("");
    setSuggestions([]);
    setInputFocused(false);
    setIsHovered(false);
  };

  // Which books to show
  const displayedBooks = showFavorites ? favorites : books;

  // Derived booleans for dropdown visibility
  const showSuggestionsDropdown = (inputFocused || isHovered) && suggestions.length > 0 && query.length >= MIN_SUGGESTION_LEN;
  const showHistoryDropdown = (inputFocused || isHovered) && query.length === 0 && searchHistory.length > 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>📚 Book Finder</h1>
          <span className="student-tag">👤 Alex (Student)</span>
        </div>

        <form onSubmit={handleSearch} className="search-bar" autoComplete="off">
          {/* Home Button */}
          <button type="button" className="home-btn" onClick={handleHomeClick}>
            Home 🏠
          </button>

          {/* Merged Search Box + Button */}
          <div
            className="search-merged"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <input
              type="text"
              placeholder="Hi Alex, Search for books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                // small delay lets onMouseDown handlers run first
                setTimeout(() => {
                  // only clear focus if not hovering
                  if (!isHovered) setInputFocused(false);
                }, 120);
              }}
            />
            <button type="submit" className="search-btn">
              Search
            </button>

            {/* History Dropdown (shown when focused/hovered and query empty) */}
            {showHistoryDropdown && (
              <ul className="history-list" role="listbox">
                {searchHistory.map((term, index) => (
                  <li key={index} className="history-item">
                    <span
                      className="history-term"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleHistoryClick(term);
                      }}
                    >
                      {term}
                    </span>
                    <span
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(term);
                      }}
                      aria-label={`Remove ${term} from history`}
                    >
                      ✕
                    </span>
                  </li>
                ))}
                <li
                  className="clear-history"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearHistory();
                  }}
                >
                  Clear All History
                </li>
              </ul>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestionsDropdown && (
              <ul className="suggestions-list" role="listbox">
                {suggestions.map((title, index) => (
                  <li
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur
                      handleSuggestionSelect(title);
                    }}
                  >
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
        {/* Loading State */}
        {loading ? (
          <p className="loading">⏳ Fetching books, please wait...</p>
        ) : !showRecents ? (
          displayedBooks.length > 0 ? (
            displayedBooks.map((book) => {
              const isFavorited = favorites.some((fav) => fav.key === book.key);
              return (
                <div
                  key={book.key || `${book.title}-${Math.random()}`}
                  className="book-card"
                  onClick={() => handleBookClick(book)}
                >
                  <img
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "https://placehold.co/150x200?text=No+Cover"
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
                          : "https://placehold.co/150x200?text=No+Cover"
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
