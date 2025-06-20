import { useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { SearchContext } from "../contexts/SearchContext";
import axios from "axios";
import WineCard from "../components/WineCard";
import NoResultsWine from "../components/NoResultsWine";
import { useSearchParams } from "react-router-dom";

const SearchResultsPage = () => {
  const { searchState, setSearchState } = useContext(SearchContext);
  const { wines } = searchState;
  const [searchParams] = useSearchParams();
  const searchParamValue = searchParams.get("search");
  const sortParamValue = searchParams.get("sort");

  useEffect(() => {
    const fetchWines = async () => {
      if (!searchParamValue?.trim()) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/wines?search=${searchParamValue}&sort=${sortParamValue}`
        );
        setSearchState((prev) => ({ ...prev, wines: response.data }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWines();
  }, [searchParamValue]);

  useEffect(() => {
    return () => {
      setSearchState((prev) => ({
        ...prev,
        wines: [],
      }));
    };
  }, []);

  const filteredWines = wines; // Non ci sono filtri applicati

  return (
    <Container className="py-4">
      {filteredWines.length === 0 ? (
        <NoResultsWine />
      ) : (
        <Row className="g-4">
          <h1 className="text-white mb-4">Riusltati per {searchParamValue}</h1>

          {filteredWines.map((wine) => (
            <Col key={wine.id} xs={12} sm={6} md={4} lg={3}>
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResultsPage;
