import React from "react";
import { Row, Col } from "react-bootstrap";

const WineBreadcrumb = ({ category, name }) => {
  return (
    <Row className="my-3" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
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
              <a href="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </a>
            </li>
            <span style={{ margin: "0 8px", color: "white" }}>/</span>

            <li className="breadcrumb-item">
              <a
                href={`/categoria/${category?.id || ""}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {category?.name || "Categoria"}
              </a>
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
