import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Button, Offcanvas } from "react-bootstrap";
import axios from "axios";

const SearchLayout = () => {
  // Stato filtri
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 200,
    sortBy: "",
    denomination: "",
    region: "",
  });

  // Stati per i valori di input indipendenti
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  const [showFilters, setShowFilters] = useState(false);

  const [denominations, setDenominations] = useState([]);
  const [regions, setRegions] = useState([]);

  // Carico denominazioni e regioni da API
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

  // Gestione cambiamenti price con controllo di validità
  const handleMinPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value <= maxPriceInput) setMinPriceInput(value);
  };

  const handleMaxPriceChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value >= minPriceInput) setMaxPriceInput(value);
  };

  // Cambia ordinamento
  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  // Cambia denominazione
  const handleDenominationChange = (e) => {
    setFilters((prev) => ({ ...prev, denomination: e.target.value }));
  };

  // Toggle region (clicca un pulsante)
  const toggleRegion = (regionName) => {
    setFilters((prev) => {
      if (prev.region === regionName) {
        return { ...prev, region: "" }; // Deseleziona se già selezionata
      }
      return { ...prev, region: regionName };
    });
  };

  // Applica i valori min/max price allo stato filtri quando si preme il bottone
  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
    }));
    setShowFilters(false);
  };

  // Componente contenuto filtri (riutilizzabile)
  const FiltersContent = () => (
    <>
      <h5 className="mb-4">Filters</h5>

      {/* Ordinamento */}
      <div className="mb-4">
        <h6>Ordina per</h6>
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

      {/* Price Range Semplificato */}
      <div className="mb-4">
        <h6>Fascia di prezzo</h6>
        <div className="row g-2">
          <div className="col-6">
            <Form.Label className="small">Min €</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="500"
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
              min="0"
              max="500"
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

      {/* Denominations Dropdown */}
      <div className="mb-4">
        <h6>Wine Denominations</h6>
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

      {/* Regions Buttons */}
      <div>
        <h6>Regions</h6>
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
        {/* Pulsante filtri mobile */}
        <div className="col-12 d-lg-none mb-3">
          <Button
            variant="dark"
            onClick={() => setShowFilters(true)}
            className="d-flex align-items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filtri
          </Button>
        </div>

        {/* Sidebar Desktop */}
        <aside className="col-lg-3 mb-4 mb-lg-0 d-none d-lg-block">
          <div
            className="text-white p-3 rounded shadow-sm"
            style={{ minHeight: "300px" }}
          >
            <FiltersContent />
            <div className="mt-4">
              <Button
                variant="primary"
                className="w-100"
                onClick={applyFilters}
              >
                Applica Filtri
              </Button>
            </div>
          </div>
        </aside>

        {/* Offcanvas Mobile */}
        <Offcanvas
          show={showFilters}
          onHide={() => setShowFilters(false)}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton className="bg-dark text-white">
            <Offcanvas.Title>Filtri</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="bg-dark text-white">
            <FiltersContent />
            <div className="mt-4">
              <Button
                variant="primary"
                className="w-100"
                onClick={applyFilters}
              >
                Applica Filtri
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main content - passo i filtri al figlio */}
        <main className="col-12 col-lg-9">
          <Outlet context={{ filters }} />
        </main>
      </div>
    </div>
  );
};

export default SearchLayout;
