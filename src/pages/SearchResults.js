import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import "../styles/SearchResults.css";

const API_KEY = "AIzaSyCWMNa-gPwvt3DZ-9XMtqZh7wri-MH5Go8";  
const SEARCH_ENGINE_ID = "f3962b910c11647ad";           
const GOOGLE_SEARCH_URL = `https://www.googleapis.com/customsearch/v1`;

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${GOOGLE_SEARCH_URL}?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}`
                );
                const data = await response.json();

                console.log("Google Search API Response:", data); // Debugging

                if (data.items) {
                    setSearchResults(data.items);
                } else {
                    console.error("No results in response:", data);
                    setSearchResults([]); // No results
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
            setLoading(false);
        };


        fetchSearchResults();
    }, [query]);

    return (
        <Container className="search-results-container">
            <h2>Search Results for: "{query}"</h2>
            {loading && <Spinner animation="border" variant="primary" />}
            {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                    <div key={index} className="search-result-item">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <strong>{item.title}</strong>
                        </a>
                        <p>{item.snippet}</p>
                    </div>
                ))
            ) : (
                !loading && <p>No results found.</p>
            )}
        </Container>
    );
};

export default SearchResults;
