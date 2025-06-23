import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WineCard from "../components/WineCard";
import GlobalContext from "../contexts/globalContext";

const CategoryPage = () => {
  const { slug } = useParams();
  const [wines, setWines] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { setIsLoading } = useContext(GlobalContext);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`http://localhost:3000/api/wines/getcategories`)
      .then((categoriesResponse) => {
        const category = categoriesResponse.data.find(
          (cat) => cat.id === parseInt(id)
        );
        setCategoryName(category ? category.name : "Categoria");

        return axios.get(`http://localhost:3000/api/wines/category/${slug}`);
      })
      .then((winesResponse) => {
        setWines(winesResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, [id]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{categoryName}</h2>
      <div className="row gy-4">
        {wines.length > 0 ? (
          wines.map((wine) => (
            <div key={wine.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <WineCard
                wine={{
                  ...wine,
                  image_url: wine.image_front_url,
                  price: parseFloat(wine.price),
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-center">No product found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
