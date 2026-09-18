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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartData } from "@/Context/CartContext";
import { ProductData } from "@/Context/ProductContext";
import { userData } from "@/Context/UserContext";
import { categories, server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();

  const { isAuth, user } = userData();

  const { id } = useParams();

  const addToCartHandler = () => {
    addToCart(id);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [show, setShow] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const updateHandler = () => {
    setShow(!show);
    setTitle(product.title);
    setDescription(product.description);
    setStock(product.stock);
    setPrice(product.price);
    setCategory(product.category);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, description, stock, price, category },
        {
          headers: {
            token: Cookies.get("token"),
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const [updatedImages, setupdatedImages] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Please select new images");
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            token: Cookies.get("token"),
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {user && user.role === "admin" && (
            <div className="w-full max-w-75 md:max-w-112.5 m-auto mb-5">
              <Button onClick={updateHandler}>{show ? <X /> : <Edit />}</Button>
              {show && (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <Label className="my-1.5">Title</Label>
                    <Input
                      placeholder="Product Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5">Description</Label>
                    <Input
                      placeholder="Product Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5">Category</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-2 rounded-md dark:bg-gray-900 dark:text-white border-2"
                    >
                      {categories.map((e) => (
                        <option value={e} key={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="mb-1.5">Price</Label>
                    <Input
                      type="number"
                      placeholder="Product Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5">Stock</Label>
                    <Input
                      type="number"
                      placeholder="Product Stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={btnLoading}
                  >
                    {btnLoading ? <Loader /> : "Update Product"}
                  </Button>
                </form>
              )}
            </div>
          )}
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

                {user && user.role === "admin" && (
                  <form
                    onSubmit={handleSubmitImage}
                    className="flex flex-col gap-4 mt-4"
                  >
                    <div>
                      <Label>Upload New Images:</Label>
                      <Input
                        type="file"
                        name="files"
                        id="files"
                        multiple
                        accept="image/*"
                        onChange={(e) => setupdatedImages(e.target.files)}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <Button type="submit" disabled={btnLoading}>
                      Update Image
                    </Button>
                  </form>
                )}
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

      {/* related products */}
      {relatedProduct?.length > 0 && (
        <>
          {loading ? (
            <Loader />
          ) : (
            <div className="container mx-auto mt-12 px-4">
              <h2 className="text-xl font-bold mb-4">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
