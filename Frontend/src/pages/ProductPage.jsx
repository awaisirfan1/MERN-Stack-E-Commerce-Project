import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CartData } from "@/Context/CartContext";
import { ProductData } from "@/Context/ProductContext";
import { userData } from "@/Context/UserContext";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();

  const { isAuth } = userData();

  const { id } = useParams();

  const addToCartHandler = () => {
    addToCart(id);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {product && (
            <div className="flex flex-col lg:flex-row items-start gap-14">
              <div className="w-72.5 md:w-162.5">
                <Carousel>
                  <CarouselContent>
                    {product.images &&
                      product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image.url}
                            alt="image"
                            className="w-full rounded-md"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-lg">{product.description}</p>
                <p className="text-xl font-semibold">Rs.{product.price}</p>
                {isAuth ? (
                  <>
                    {product.stock <= 0 ? (
                      <p className="text-red-500">Out of Stock</p>
                    ) : (
                      <Button onClick={addToCartHandler}>Add to Cart</Button>
                    )}
                  </>
                ) : (
                  <p className="text-blue-500">
                    Please Login to add something in cart
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {relatedProduct?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {relatedProduct.map((e) => (
              <ProductCard key={e._id} product={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
