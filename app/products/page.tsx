"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  title: string;
  price: string;
  imageUrl: string;
  productUrl: string;
}

const Product: React.FunctionComponent<{ product: Product }> = ({
  product,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-all">
      <div className="relative w-full h-64">
        <Image
          src={product.imageUrl}
          alt={product.title}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
        <span className="text-lg font-bold text-green-600">
          {product.price}
        </span>
        <button
          onClick={() =>
            (window.location.href =
              "/product/" +
              product.title.trim().replace("/", "").replace(" ", "") +
              "?url=" +
              product.productUrl)
          }
          className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all p-2 w-full"
        >
          Переглянути
        </button>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<{ [key: number]: Product[] }>({});
  const productsPerPage = 18;

  const fetchProducts = async (page: number) => {
    const newProducts: Product[] = await axios
      .get("http://localhost:3001/parse-rozetka")
      .then((response) => {
        return response.data;
      });
    console.log(newProducts);
    setProducts((prev) => ({ ...prev, [page]: newProducts }));
  };

  useEffect(() => {
    if (!products[page]) {
      fetchProducts(page);
    }
  }, [page]);

  return (
    <div>
      {products[page] ? (
        <div className="grid grid-cols-6 gap-4">
          {(products[page] || []).map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-80">
          <p className="text-xl font-bold">Триває парсинг, зачекайте...</p>
        </div>
      )}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Prev
        </button>
        <span className="px-4 py-2 border border-gray-300 rounded-md text-center w-16">
          {page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
