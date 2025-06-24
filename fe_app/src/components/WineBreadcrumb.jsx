import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const WineBreadcrumb = ({ category, name }) => {
  const isCategoryPage = !!category && !name;

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
                <i className="fa fa-home" style={{ marginRight: 6 }} /> Home
              </Link>
            </li>

            {category && (
              <>
                <li
                  className="breadcrumb-item"
                  style={{ margin: "0 8px", color: "white" }}
                >
                  /
                </li>

                {isCategoryPage ? (
                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                    style={{ color: "#B1A44B", fontWeight: "bold" }}
                  >
                    {category.name || "Categoria"}
                  </li>
                ) : (
                  <li className="breadcrumb-item">
                    <Link
                      to={`/categoria/${category.slug}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      {category.name || "Categoria"}
                    </Link>
                  </li>
                )}
              </>
            )}

            {name && (
              <>
                <li
                  className="breadcrumb-item"
                  style={{ margin: "0 8px", color: "white" }}
                >
                  /
                </li>
                <li
                  className="breadcrumb-item active"
                  aria-current="page"
                  style={{ color: "#B1A44B", fontWeight: "bold" }}
                >
                  {name}
                </li>
              </>
            )}
          </ol>
        </nav>
      </Col>
    </Row>
  );
};

export default WineBreadcrumb;
