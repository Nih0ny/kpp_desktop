import Image from "next/image";
import React from "react";

interface Product {
  asin: string;
  product_title: string;
  product_price: string;
  product_original_price: string;
  currency: string;
  product_star_rating: string;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_num_offers: number;
  product_minimum_offer_price: string;
  is_best_seller: boolean;
  is_amazon_choice: boolean;
  is_prime: boolean;
  product_availability?: string;
  climate_pledge_friendly: boolean;
  sales_volume: string;
  delivery: string;
  has_variations: boolean;
}

const Product: React.FunctionComponent<{ product: Product }> = ({
  product,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-all">
      <div className="relative w-full h-64">
        <Image
          src={product.product_photo}
          alt={product.product_title}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {product.product_title}
        </h2>
        <p className="text-sm text-gray-500">ASIN: {product.asin}</p>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-lg font-bold text-green-600">
            {product.product_price}
          </span>
          <span className="text-sm line-through text-gray-400">
            {product.product_original_price}
          </span>
        </div>
        <p className="text-sm text-gray-500">Currency: {product.currency}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500 font-bold">
            {product.product_star_rating}★
          </span>
          <span className="ml-2 text-sm text-gray-600">
            ({product.product_num_ratings} reviews)
          </span>
        </div>
        {product.is_prime && (
          <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md mt-2 inline-block">
            Prime
          </span>
        )}
        {product.is_best_seller && (
          <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded-md ml-2">
            Best Seller
          </span>
        )}
        {product.is_amazon_choice && (
          <span className="bg-black text-white px-2 py-1 text-xs rounded-md ml-2">
            Amazon`s Choice
          </span>
        )}
        <p className="text-sm text-gray-700 mt-2">{product.sales_volume}</p>
        <p className="text-sm text-gray-700">{product.delivery}</p>
        {product.product_availability ? (
          <p className="text-sm font-semibold text-red-600">
            {product.product_availability}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Availability: Information not available
          </p>
        )}
        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
};

export default function ProductPage(): React.ReactElement {
  const productData: Product = {
    asin: "B0CRVWXJ6H",
    product_title:
      "Samsung Galaxy A25 5G (SM-A256E/DS), 128GB 6GB RAM, Dual SIM, Factory Unlocked GSM, International Version (Wall Charger Bundle) - (Blue Black)",
    product_price: "$182.00",
    product_original_price: "$194.99",
    currency: "USD",
    product_star_rating: "4.1",
    product_num_ratings: 113,
    product_url: "https://www.amazon.com/dp/B0CRVWXJ6H",
    product_photo:
      "https://m.media-amazon.com/images/I/51m744UUjYL._AC_UY654_FMwebp_QL65_.jpg",
    product_num_offers: 20,
    product_minimum_offer_price: "$169.99",
    is_best_seller: false,
    is_amazon_choice: false,
    is_prime: true,
    product_availability: "Only 15 left in stock - order soon.",
    climate_pledge_friendly: false,
    sales_volume: "1K+ bought in past month",
    delivery: "FREE delivery Wed, Jul 10 Only 15 left in stock - order soon.",
    has_variations: true,
  };

  return (
    <>
      <Product product={productData} />
    </>
  );
}
