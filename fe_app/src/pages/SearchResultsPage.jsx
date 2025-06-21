import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";
import NoResultsWine from "../components/NoResultsWine";
import { useSearchParams } from "react-router-dom";

const SearchResultsPage = () => {
  const [wines, setWines] = useState([]); // Stato locale semplice
  const [loading, setLoading] = useState(false); // Bonus: loading state
  const [searchParams] = useSearchParams();

  const searchParamValue = searchParams.get("search");
  const categoryParamValue = searchParams.get("category");
  const sortParamValue = searchParams.get("sort");

  useEffect(() => {
    const fetchWines = async () => {
      if (!searchParamValue?.trim()) {
        setWines([]);
        return;
      }

      setLoading(true);
      try {
        // Costruisci l'URL con tutti i parametri
        let apiUrl = `http://localhost:3000/api/wines?search=${encodeURIComponent(
          searchParamValue
        )}`;

        if (categoryParamValue && categoryParamValue !== "all") {
          apiUrl += `&category=${categoryParamValue}`;
        }

        if (sortParamValue) {
          apiUrl += `&sort=${sortParamValue}`;
        }

        console.log("Chiamata API:", apiUrl);

        const response = await axios.get(apiUrl);
        setWines(response.data);
      } catch (error) {
        console.error("Error:", error);
        setWines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [searchParamValue, categoryParamValue, sortParamValue]);

  // Pulisci i risultati quando il componente viene smontato
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

  return (
    <Container className="py-4">
      {wines.length === 0 ? (
        <NoResultsWine />
      ) : (
        <Row className="g-4">
          <h1 className="text-white mb-4">
            Risultati per "{searchParamValue}"
            {categoryParamValue && categoryParamValue !== "all" && (
              <span className="fs-6 text-muted d-block">
                nella categoria selezionata
              </span>
            )}
          </h1>

          {wines.map((wine) => (
            <Col key={wine.id} xs={12} sm={6} md={4} xl={4} xxl={3}>
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResultsPage;
