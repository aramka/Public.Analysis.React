import React, { FocusEvent, KeyboardEvent, useEffect, useId, useState } from "react";
import { SearchResult } from "./models/search-result";
import { searchService} from "./services/search-service";
import "./search.css";

interface SearchProps {
  onSelect: (result: SearchResult) => void;
  searchType?: string;
}

export const Search: React.FC<SearchProps> = ({
  onSelect,
  searchType
}) => {
  const inputId = useId();
  const resultsId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const selectResult = (result: SearchResult) => {
    setQuery(result.label);
    setSelectedResult(result);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect(result);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      if (results.length > 0) {
        setActiveIndex((index) => (index + 1) % results.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      if (results.length > 0) {
        setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      }
    } else if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      selectResult(results[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    const searchQuery = query.trim();
    if (!searchQuery || selectedResult?.label === query) {
      setResults([]);
      setLoading(false);
      setError(null);
      setActiveIndex(-1);
      return;
    }

    let isCurrentRequest = true;
    setResults([]);
    setActiveIndex(-1);
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
  }, [query, searchType, selectedResult]);

  return (
    <section
      className="search"
      aria-labelledby={`${inputId}-heading`}
      onBlur={handleBlur}
    >
      <div className="search__control">
        <input
          id={inputId}
          type="search"
          role="combobox"
          value={query}
          onChange={(event) => {
            setSelectedResult(null);
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen && query.trim().length > 0}
          aria-controls={resultsId}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${resultsId}-option-${activeIndex}` : undefined
          }
        />
        {isOpen && query.trim() && (
          <div className="search__dropdown">
            {loading && <div className="search__message" role="status">Searching...</div>}
            {error && <div className="search__message" role="alert">Search failed: {error.message}</div>}
            {!loading && !error && results.length === 0 && (
              <div className="search__message" role="status">No results found.</div>
            )}
            {!error && results.length > 0 && (
              <ul id={resultsId} className="search__results" role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                  <li
                    id={`${resultsId}-option-${index}`}
                    key={result.id}
                    className={`search__option${index === activeIndex ? " search__option--active" : ""}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectResult(result)}
                  >
                    {result.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
