const wineFormat = (wine, req) => ({
  id: wine.id,
  name: wine.name,
  category: {
    id: wine.category,
    name: wine.category_name,
    slug: wine.category_slug,
  },
  price: wine.price,
  alcol: wine.alcol,
  slug: wine.slug,
  bottle_size: wine.bottle_size,
  vintage: wine.vintage,
  stock: wine.stock,
  image_front_url: req.imagePath + wine.image_front_url,
  image_back_url: req.imagePath + wine.image_back_url,
  grape_type: wine.grape_type,
  label_condition: {
    id: wine.label_condition,
    name: wine.label_condition_name,
    rating: wine.label_condition_rating,
  },
  bottle_condition: {
    id: wine.bottle_condition,
    name: wine.bottle_condition_name,
    rating: wine.bottle_condition_rating,
  },
  region: {
    id: wine.region,
    name: wine.region_name,
  },
  temperature: wine.temperature,
  winemaker: {
    id: wine.winemaker,
    name: wine.winemaker_name,
  },
  description: wine.description,
  denomination: {
    id: wine.denomination,
    name: wine.denomination_name,
  },
});

module.exports = wineFormat;
