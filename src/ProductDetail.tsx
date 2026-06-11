import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://shoe-store-backend-rkuw.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-lg">
        <Link
          to="/"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Quay lại cửa hàng
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
         
          <div>
            <img
              src={product.image}
              alt={product.name}
              className=" w-full rounded-xl object-cover"
            />
          </div>

          {/* Thông tin */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">
              {product.name}
            </h1>

            <p className="mb-6 text-3xl font-bold text-red-500">
              {product.price?.toLocaleString()} VNĐ
            </p>

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 text-lg font-semibold">Mô tả sản phẩm</h3>
              <p className="leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4">
              <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Mua ngay
              </button>

              <button className="rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;