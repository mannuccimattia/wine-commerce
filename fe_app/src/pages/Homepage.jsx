// import axios from 'axios'
import CategoriesCard from "../components/CategoriesCard";
import HeroCarousel from "../components/HeroCarousel";
import BestSellers from "../components/BestSellers";
import PremiumVintage from "../components/PremiumVintage";
const Homepage = () => {
  return (
    <>
      <HeroCarousel />
      <div className="homepage-background">
        <CategoriesCard />
        <PremiumVintage />
        <BestSellers />
      </div>
    </>
  );
};

export default Homepage;
