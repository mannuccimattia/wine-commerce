import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WineCard from "../components/WineCard";
import GlobalContext from "../contexts/globalContext";
import WineBreadcrumb from "../components/WineBreadcrumb";

const CategoryPage = () => {
  const { slug } = useParams();
  const [wines, setWines] = useState([]);
  const [category, setCategory] = useState(null);
  const { setIsLoading } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Get all categories
        const categoriesResponse = await axios.get(
          "http://localhost:3000/api/wines/getcategories"
        );

        // 2. Find the category that matches the slug
        const foundCategory = categoriesResponse.data.find(
          (cat) => cat.slug === slug
        );
        setCategory(foundCategory || null);

        // 3. Get the wines for this category
        const winesResponse = await axios.get(
          `http://localhost:3000/api/wines/categoria/${slug}`
        );
        setWines(winesResponse.data);
      } catch (error) {
        console.error("Error loading category or wines:", error);
        setCategory(null);
        setWines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, setIsLoading]);

  return (
    <div className="container my-5">
      <WineBreadcrumb category={category} />

      <h2 className="text-center mb-4">
        {category ? category.name : "Category"}
      </h2>
      <div className="row gy-4">
        {wines.length > 0 ? (
          wines.map((wine) => (
            <div key={wine.id} className="col-12 col-md-6 col-xl-4 col-xxl-3">
              <WineCard
                wine={{
                  ...wine,
                  image_url: wine.image_front_url,
                  price: wine.price,
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
