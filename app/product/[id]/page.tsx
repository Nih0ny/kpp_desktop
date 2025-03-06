"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

interface Product {
  title: string | null;
  price: string | null;
  oldPrice: string | null;
  rating: string | null;
  reviewCount: string | null;
  availability: string | null;
  seller: string | null;
  images: string | null;
  breadcrumbs: string | null;
  description: string | null;
  attributes: string | null;
  reviews: string | null;
  similarProducts: string | null;
  url: string | null;
}

const Product: React.FunctionComponent<{ product: Product }> = ({
  product,
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Заголовок */}
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

      {/* Основний блок */}
      <div className="grid grid-cols-2 gap-6">
        {/* Карусель зображень */}
        <div>
          <Carousel showThumbs={false} infiniteLoop>
            {product.images.map((img, index) => (
              <div key={index}>
                <img src={img} alt={product.title} className="rounded-lg" />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Інформація справа */}
        <div className="space-y-4">
          <p className="text-lg font-semibold">Ціна: {product.price} грн</p>
          {product.oldPrice && (
            <p className="text-red-500 line-through">
              Стара ціна: {product.oldPrice} грн
            </p>
          )}
          <p className="text-green-600 font-semibold">{product.availability}</p>
          <p className="text-gray-600">{product.breadcrumbs}</p>
        </div>
      </div>

      {/* Опис товару */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Опис</h2>
        <p dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Атрибути товару */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Характеристики</h2>
        <div>
          {product.attributes.map((attr, index) => (
            <p key={index}>
              <span className="font-bold">{attr.label}</span> - {attr.text}
            </p>
          ))}
        </div>
      </div>

      {/* Схожі товари */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Схожі товари</h2>
        <div className="flex gap-4 overflow-x-auto">
          {product.similarProducts.map(
            (product, index) =>
              product.title && (
                <div
                  key={index}
                  className="w-48 p-4 border rounded-lg shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="text-md font-semibold mt-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold">{product.price} грн</p>
                  <Button asChild>
                    <button
                      onClick={() =>
                        (window.location.href =
                          "/product/" +
                          product.title.trim().replace("/", "") +
                          "?url=" +
                          product.href)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Перейти
                    </button>
                  </Button>
                </div>
              )
          )}
        </div>
      </div>

      {/* Кнопка для переходу */}
      <div className="mt-6 text-center">
        <Button asChild>
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            Відкрити в браузері
          </a>
        </Button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProducts] = useState<Product | null | any>(null);

  const fetchProduct = async () => {
    console.log(window.location.href.split("?")[1].split("=")[1]);
    console.log("!!!");
    const newProduct: Product = await axios
      .get(
        "http://localhost:3001/parse-rozetka-page?url=" +
          window.location.href.split("?")[1].split("=")[1]
      )
      .then((response) => {
        return response.data;
      });
    console.log(newProduct);
    setProducts(newProduct);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Нові дані
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };

  return product ? (
    <Product product={product}></Product>
  ) : (
    <div style={styles.loadingContainer}>
      <p style={styles.loadingText}>Триває парсинг, зачекайте...</p>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center", // Відцентровано по горизонталі
    alignItems: "center", // Відцентровано по вертикалі
    height: "100vh", // Висота на весь екран
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Прозорий фон, щоб не було видно тільки фон браузера
    position: "fixed", // Закріплення на екрані
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingText: {
    fontSize: "24px", // Можна налаштувати розмір тексту
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default ProductPage;
