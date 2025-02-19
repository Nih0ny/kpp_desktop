"use client";
import { useState } from "react";
import React from "react";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";

const ProductPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Тестові дані вбудовані в компонент
  const data = {
    status: "OK",
    request_id: "d79b2efe-f47e-4af1-a889-e65ee12d9730",
    parameters: {
      asin: "B0B9CZ6XBQ",
      country: "US",
    },
    data: {
      asin: "B0B9CZ6XBQ",
      product_title: "Ninja CREAMi Deluxe Ice Cream & Frozen Treat Maker",
      product_price: "224.97",
      product_original_price: "$249.99",
      currency: "USD",
      country: "US",
      product_byline: "Visit the Ninja Store",
      product_star_rating: "4.4",
      product_num_ratings: 3595,
      product_photos: [
        "https://m.media-amazon.com/images/I/71t9VcZQVVL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81JydkiexZL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/712vzqEuUcL._AC_SL1500_.jpg",
      ],
      product_availability: "Only 20 left in stock - order soon.",
      is_amazon_choice: true,
      sales_volume: "9K+ bought in past month",
      delivery: "FREE delivery February 13 - 14",
      about_product: [
        "ADDED PROGRAMS: Unlock a variety of CREAMi frozen treats with 5 new programs.",
        "XL CAPACITY: Family-sized treats for everyone to enjoy.",
        "DUAL PROCESSING: Use the same base to make two separate mix-in flavors.",
        "CUSTOMIZATION: Control ingredients for dietary preferences",
        "EASY TO USE: Create treats in three simple steps",
      ],
      product_description:
        "The Ninja CREAMi Deluxe turns almost anything into ice cream, sorbet, gelato, and much more. Go beyond ice cream with 5 new programs including Italian Ice and Frozen Yogurt.",
      product_information: {
        Brand: "Ninja",
        Color: "Silver",
        Capacity: "20.81 Fluid Ounces",
        "Special Feature": "Dishwasher Safe Parts",
        Material: "Plastic",
      },
      product_videos: [
        {
          id: "video1",
          title: "Product Overview",
          thumbnail_url:
            "https://m.media-amazon.com/images/I/517u2Z0IzYL.SS125_PKplay-button-mb-image-grid-small_.jpg",
        },
        {
          id: "video2",
          title: "How to Use",
          thumbnail_url:
            "https://m.media-amazon.com/images/I/517u2Z0IzYL.SS125_PKplay-button-mb-image-grid-small_.jpg",
        },
      ],
      category_path: [
        {
          id: "1055398",
          name: "Home & Kitchen",
        },
        {
          id: "284507",
          name: "Kitchen & Dining",
        },
        {
          id: "289913",
          name: "Small Appliances",
        },
      ],
    },
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < data.data.product_photos.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : data.data.product_photos.length - 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        {data.data.category_path?.map((cat, index) => (
          <span key={cat.id}>
            {index > 0 && " / "}
            {cat.name}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="relative">
          <div className="relative aspect-square">
            <Image
              src={data.data.product_photos[currentImageIndex]}
              alt={data.data.product_title}
              className="w-full h-full object-cover rounded-lg"
              width={800}
              height={800}
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {data.data.product_photos.map((photo, index) => (
              <Image
                key={index}
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer 
                  ${
                    currentImageIndex === index
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                  }`}
                width={800}
                height={800}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">
                {data.data.product_title}
              </h1>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(Number(data.data.product_star_rating))
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {data.data.product_star_rating} ({data.data.product_num_ratings}{" "}
                reviews)
              </span>
            </div>
          </div>

          {/* Price Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${data.data.product_price}
                </span>
                {data.data.product_original_price && (
                  <span className="ml-2 text-gray-500 line-through">
                    {data.data.product_original_price}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {data.data.is_amazon_choice && (
                  <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm">
                    Amazon`s Choice
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {data.data.product_availability}
                  </span>
                </div>
                {data.data.sales_volume && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {data.data.sales_volume}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{data.data.delivery}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">About this item</h3>
                  <ul className="space-y-2">
                    {data.data.about_product.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 mt-4">
                    {data.data.product_description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Product Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(data.data.product_information).map(
                      ([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <span className="text-gray-600">{key}:</span>
                          <span className="ml-2 font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-4">
                    <p>{data.data.delivery}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Videos Section */}
      {data.data.product_videos && data.data.product_videos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.product_videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full rounded-lg mb-2"
                    width={200}
                    height={200}
                  />
                  <h3 className="font-medium">{video.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
