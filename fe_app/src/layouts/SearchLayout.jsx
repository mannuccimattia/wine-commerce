import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Offcanvas } from "react-bootstrap";

const SearchLayout = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const denominations = ["DOP", "DOCG", "IGT", "DOC", "VdT"];
  const regions = ["Tuscany", "Piedmont", "Sicily", "Veneto", "Lombardy"];

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value < maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > minPrice) {
      setMaxPrice(value);
    }
  };

  // Componente filtri riutilizzabile
  const FiltersContent = () => (
    <>
      <h5 className="mb-4">Filters</h5>

      {/* Ordinamento */}
      <div className="mb-4">
        <h6>Ordina per</h6>
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
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
              value={minPrice}
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
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="bg-dark text-white border-secondary"
              size="sm"
            />
          </div>
        </div>
        <div className="text-center mt-2">
          <small className="text-muted">
            €{minPrice} - €{maxPrice}
          </small>
        </div>
      </div>

      {/* Denominations Dropdown */}
      <div className="mb-4">
        <h6>Wine Denominations</h6>
        <Form.Group controlId="denominations">
          <Form.Select className="bg-dark text-white border-secondary">
            <option>Select a denomination</option>
            {denominations.map((denomination, index) => (
              <option key={index} value={denomination}>
                {denomination}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {/* Regions Buttons */}
      <div>
        <h6>Regions</h6>
        <div className="d-flex flex-wrap">
          {regions.map((region, index) => (
            <Button
              key={index}
              variant="outline-light"
              className="m-1"
              size="sm"
            >
              {region}
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
            className=" text-white p-3 rounded shadow-sm"
            style={{ minHeight: "300px" }}
          >
            <FiltersContent />
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
                onClick={() => setShowFilters(false)}
              >
                Applica Filtri
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main content */}
        <main className="col-12 col-lg-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SearchLayout;
