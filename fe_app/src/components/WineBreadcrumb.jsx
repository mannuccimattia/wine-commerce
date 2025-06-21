import React from "react";
import { Row, Col } from "react-bootstrap";

const WineBreadcrumb = ({ category, name }) => {
  return (
    <Row>
      <Col>
        <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb breadcrumb-divider"
            style={{ color: "white" }}
          >
            <li className="breadcrumb-item">
              <a href="#" style={{ color: "white", textDecoration: "none" }}>
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a
                href={`/categoria/${category.id}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {category.name}
              </a>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              style={{ color: "#B1A44B", fontWeight: "bold" }}
            >
              {name}
            </li>
          </ol>
        </nav>
      </Col>
    </Row>
  );
};

export default WineBreadcrumb;
