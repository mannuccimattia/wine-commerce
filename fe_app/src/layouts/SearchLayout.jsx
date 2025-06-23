import { Outlet, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Button, Offcanvas } from "react-bootstrap";
import axios from "axios";

const SearchLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    minPrice: parseInt(searchParams.get("minPrice")) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice")) || 5000,
    sortBy: searchParams.get("sortBy") || "",
    denomination: searchParams.get("denomination") || "",
    region: searchParams.get("region") || "",
  });

  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  const [showFilters, setShowFilters] = useState(false);

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  useEffect(() => {
    if (
      debouncedMinPrice !== filters.minPrice ||
      debouncedMaxPrice !== filters.maxPrice
    ) {
      const newFilters = {
        ...filters,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
      };
      setFilters(newFilters);
      updateURLParams(newFilters);
    }
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const [denominations, setDenominations] = useState([]);
  const [regions, setRegions] = useState([]);

  const updateURLParams = (newFilters) => {
    const currentParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    setSearchParams(currentParams);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/api/wines/getdenominations")
      .then((res) => setDenominations(res.data))
      .catch((err) => console.log("Errore Caricamento Denominazioni", err));

    axios
      .get("http://127.0.0.1:3000/api/wines/getregions")
      .then((res) => setRegions(res.data))
      .catch((err) => console.log("Errore Caricamento Regioni", err));
  }, []);

  const handleMinPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value <= maxPriceInput && value >= 0) setMinPriceInput(value);
  };

  const handleMaxPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value >= minPriceInput && value >= 0) setMaxPriceInput(value);
  };

  const handleSortChange = (e) => {
    const newFilters = { ...filters, sortBy: e.target.value };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleDenominationChange = (e) => {
    const newFilters = { ...filters, denomination: e.target.value };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const toggleRegion = (regionName) => {
    const newRegion = filters.region === regionName ? "" : regionName;
    const newFilters = { ...filters, region: newRegion };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      minPrice: 0,
      maxPrice: 5000,
      sortBy: "",
      denomination: "",
      region: "",
    };
    setFilters(resetFilters);
    setMinPriceInput(0);
    setMaxPriceInput(5000);

    const currentParams = new URLSearchParams(searchParams);
    const preservedParams = new URLSearchParams();

    if (currentParams.has("search")) {
      preservedParams.set("search", currentParams.get("search"));
    }
    if (currentParams.has("category")) {
      preservedParams.set("category", currentParams.get("category"));
    }

    setSearchParams(preservedParams);
  };

  const getFullURLParams = () => {
    const params = new URLSearchParams(searchParams);
    return {
      search: params.get("search") || "",
      category: params.get("category") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sortBy: params.get("sortBy") || "",
      denomination: params.get("denomination") || "",
      region: params.get("region") || "",
    };
  };

  const FiltersContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Choose filters</h5>
        <Button
          variant="outline-light"
          size="sm"
          onClick={resetFilters}
          className="text-decoration-none"
        >
          Reset
        </Button>
      </div>

      <div className="mb-4">
        <h6>Order by</h6>
        <Form.Select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="bg-dark text-white border-secondary"
        >
          <option value="">Seleziona ordinamento</option>
          <option value="price-asc">Prezzo: dal più economico</option>
          <option value="price-desc">Prezzo: dal più caro</option>
          <option value="year-asc">Annata: dalla più vecchia</option>
          <option value="year-desc">Annata: dalla più recente</option>
        </Form.Select>
      </div>

      <div className="mb-4">
        <h6>Fascia di prezzo</h6>
        <div className="row g-2">
          <div className="col-6">
            <Form.Label className="small">Min €</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="50"
              value={minPriceInput}
              onChange={handleMinPriceChange}
              className="bg-dark text-white border-secondary"
              size="sm"
            />
          </div>
          <div className="col-6">
            <Form.Label className="small">Max €</Form.Label>
            <Form.Control
              type="number"
              max="5000"
              step="50"
              value={maxPriceInput}
              onChange={handleMaxPriceChange}
              className="bg-dark text-white border-secondary"
              size="sm"
            />
          </div>
        </div>
        <div className="text-center mt-2">
          <small className="text-muted">
            €{minPriceInput} - €{maxPriceInput}
          </small>
        </div>
      </div>

      <div className="mb-4">
        <h6>Denominazione</h6>
        <Form.Group controlId="denominations">
          <Form.Select
            className="bg-dark text-white border-secondary"
            value={filters.denomination}
            onChange={handleDenominationChange}
          >
            <option value="">Seleziona una denominazione</option>
            {denominations.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <div>
        <h6>Regione</h6>
        <div className="d-flex flex-wrap">
          {regions.map(({ id, name }) => (
            <Button
              key={id}
              variant={filters.region === name ? "primary" : "outline-light"}
              className="m-1"
              size="sm"
              onClick={() => toggleRegion(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 d-lg-none mb-3">
          <Button
            variant="dark"
            onClick={() => setShowFilters(true)}
            className="d-flex align-items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filters
          </Button>
        </div>

        <aside className="col-lg-3 mb-4 mb-lg-0 d-none d-lg-block">
          <div
            className="text-white p-3 rounded shadow-sm"
            style={{ minHeight: "300px" }}
          >
            <FiltersContent />
          </div>
        </aside>

        <Offcanvas
          show={showFilters}
          onHide={() => setShowFilters(false)}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton className="bg-dark text-white">
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="bg-dark text-white">
            <FiltersContent />
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => setShowFilters(false)}
              >
                Close
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <main className="col-12 col-lg-9">
          <Outlet context={{ filters, getFullURLParams }} />
        </main>
      </div>
    </div>
  );
};

export default SearchLayout;
