import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://shoe-store-backend-rkuw.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <h1 className="py-8 text-center text-5xl font-bold text-gray-800">
        👟 Cửa hàng giày
      </h1>

      {/* Danh sách sản phẩm */}
      <div className="mx-auto grid max-w-10xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                {product.name}
              </h2>

              <p className="mb-4 text-xl font-bold text-red-500">
                {product.price.toLocaleString()} VNĐ
              </p>

              <Link
                to={`/product/${product.id}`}
                className="block rounded-lg bg-blue-600 py-2 text-center font-medium text-white transition hover:bg-blue-700"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;