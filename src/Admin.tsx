import { useEffect, useState } from "react";

const API = "https://shoe-store-backend-rkuw.onrender.com/api/products";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const emptyForm = { name: "", price: "", image: "", description: "" };

function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const notify = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), image: p.image, description: p.description });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.image || !form.description) {
      alert("Điền đầy đủ thông tin.");
      return;
    }
    const body = { ...form, price: Number(form.price) };

    if (editingId) {
      const res = await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) notify("✅ Cập nhật thành công");
      else notify("❌ Lỗi cập nhật");
    } else {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) notify("✅ Thêm thành công");
      else notify("❌ Lỗi thêm sản phẩm");
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) notify("🗑️ Đã xóa sản phẩm");
    else notify("❌ Lỗi xóa");
    load();
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 20 }}>Quản lý sản phẩm</h1>

      {msg && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, padding: "10px 16px", marginBottom: 16, color: "#166534" }}>
          {msg}
        </div>
      )}

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 24 }}>
          <h2 style={{ marginBottom: 16, fontSize: 18 }}>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Tên sản phẩm</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nike Air Max 90"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Giá (VNĐ)</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="1200000"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Link ảnh</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..."
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Mô tả sản phẩm..."
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSubmit}
              style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
              {editingId ? "Cập nhật" : "Thêm sản phẩm"}
            </button>
            <button onClick={handleCancel}
              style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 16px", fontSize: 14, cursor: "pointer" }}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={openAdd}
          style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "9px 18px", fontSize: 14, cursor: "pointer", marginBottom: 20 }}>
          + Thêm sản phẩm
        </button>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>Ảnh</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>Tên</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>Giá</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>Mô tả</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <img src={p.image} alt={p.name}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, background: "#f3f4f6" }}
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/56"; }} />
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, fontSize: 14 }}>{p.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 14 }}>{p.price.toLocaleString("vi-VN")} ₫</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#6b7280", maxWidth: 240 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.description}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)}
                        style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 5, padding: "5px 12px", fontSize: 13, cursor: "pointer" }}>
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: 5, padding: "5px 12px", fontSize: 13, cursor: "pointer" }}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;