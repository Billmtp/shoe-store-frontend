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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 16,
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Quản lý sản phẩm</h1>

      {msg && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 14px", marginBottom: 14, color: "#166534", fontSize: 14 }}>
          {msg}
        </div>
      )}

      {/* Form thêm / sửa */}
      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, marginBottom: 14 }}>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>Tên sản phẩm</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nike Air Max 90" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>Giá (VNĐ)</label>
              <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="1200000" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>Link ảnh</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>Mô tả</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Mô tả sản phẩm..."
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={handleSubmit}
                style={{ flex: 1, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, cursor: "pointer", fontWeight: 500 }}>
                {editingId ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
              <button onClick={handleCancel}
                style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: 8, padding: "12px", fontSize: 15, cursor: "pointer" }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={openAdd}
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, cursor: "pointer", marginBottom: 18, fontWeight: 500 }}>
          + Thêm sản phẩm
        </button>
      )}

      {loading ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>Đang tải...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>Chưa có sản phẩm nào</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <img src={p.image} alt={p.name}
                style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#f3f4f6" }}
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/72"; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{p.name}</div>
                <div style={{ color: "#2563eb", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                  {p.price.toLocaleString("vi-VN")} ₫
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.description}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => openEdit(p)}
                    style={{ flex: 1, background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 7, padding: "8px", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
                    ✏️ Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)}
                    style={{ flex: 1, background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", borderRadius: 7, padding: "8px", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;