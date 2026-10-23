import React, { useEffect, useId, useState } from "react";
import { SearchResult, SearchService } from "./models/search-result";
import { searchService as defaultSearchService } from "./services/search-service";

interface SearchProps {
  onSelect: (result: SearchResult) => void;
  searchService?: SearchService;
  searchType?: string;
}

export const Search: React.FC<SearchProps> = ({
  onSelect,
  searchService = defaultSearchService,
  searchType
}) => {
  const inputId = useId();
  const resultsId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const searchQuery = query.trim();
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isCurrentRequest = true;
    setResults([]);
    setLoading(true);
    setError(null);

    searchService(searchQuery, searchType)
      .then((searchResults) => {
        if (isCurrentRequest) {
          setResults(searchResults);
        }
      })
      .catch((searchError: unknown) => {
        if (isCurrentRequest) {
          setError(searchError instanceof Error ? searchError : new Error(String(searchError)));
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [query, searchService, searchType]);

  return (
    <section aria-labelledby={`${inputId}-heading`}>
      <h2 id={`${inputId}-heading`}>Search</h2>
      <label htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
        aria-controls={resultsId}
      />
      {loading && <p role="status">Searching...</p>}
      {error && <p role="alert">Search failed: {error.message}</p>}
      {!loading && !error && query.trim() && results.length === 0 && (
        <p role="status">No results found.</p>
      )}
      {results.length > 0 && (
        <ul id={resultsId} aria-label="Search results">
          {results.map((result) => (
            <li key={result.id}>
              <button type="button" onClick={() => onSelect(result)}>
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
