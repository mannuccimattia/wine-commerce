import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";
import NoResultsWine from "../components/NoResultsWine";
import { useSearchParams } from "react-router-dom";

const SearchResultsPage = () => {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchWines = async () => {
      const search = searchParams.get("search");
      const category = searchParams.get("category");
      const sortBy = searchParams.get("sortBy");
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const region = searchParams.get("region");
      const denomination = searchParams.get("denomination");

      if (!search?.trim()) {
        setWines([]);
        return;
      }

      setLoading(true);

      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== "all") params.category = category;
        if (sortBy) params.sortBy = sortBy;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (region) params.region = region;
        if (denomination) params.denomination = denomination;

        console.log("🔍 Parametri inviati al backend:", params);

        const response = await axios.get("http://localhost:3000/api/wines", {
          params,
        });

        setWines(response.data);
      } catch (error) {
        console.error("Errore nella richiesta:", error);
        setWines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [searchParams]);

  useEffect(() => {
    return () => setWines([]);
  }, []);

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </Container>
    );
  }

  const searchValue = searchParams.get("search");
  const categoryValue = searchParams.get("category");

  return (
    <>
      {wines.length === 0 ? (
        <NoResultsWine />
      ) : (
        <Row className="g-4">
          <h4 className="text-white mb-4">
            Results for "{searchValue}"
            {categoryValue && categoryValue !== "all" && (
              <span className="fs-6 text-white d-block">
                within chosen category
              </span>
            )}
          </h4>

          {wines.map((wine) => (
            <Col key={wine.id} sm={12} md={6} xl={4}>
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default SearchResultsPage;
