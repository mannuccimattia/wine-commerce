import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const WineBreadcrumb = ({ category, name }) => {
  return (
    <Row className="my-3">
      <Col>
        <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb"
            style={{
              display: "flex",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "white",
              fontSize: "1rem",
            }}
          >
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <span style={{ margin: "0 8px", color: "white" }}>/</span>

            <li className="breadcrumb-item">
              <Link
                to={`/categoria/${category?.slug || ""}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {category?.name || "Categoria"}
              </Link>
            </li>
            <span style={{ margin: "0 8px", color: "white" }}>/</span>

            <li
              className="breadcrumb-item active"
              aria-current="page"
              style={{
                color: "#B1A44B",
                fontWeight: "bold",
              }}
            >
              {name || "Nome vino"}
            </li>
          </ol>
        </nav>
      </Col>
    </Row>
  );
};

export default WineBreadcrumb;
