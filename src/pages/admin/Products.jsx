import { useState, useEffect } from 'react';
import { productApi } from '../../api/endpoints';
import MultiImageUpload from '../../components/MultiImageUpload';
import SampleImagesUpload from '../../components/SampleImagesUpload';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', brand: 'Canon', category: 'Chuyên nghiệp',
    description: '', images: [], mainImage: '', stock: 1, isAvailable: true,
    isFeatured: false, isHot: false, isNew: false,
    pricing: { price6h: 0, price12h: 0, price1d: 0, price2d: 0, pricePerDay: 0 },
    sampleImages: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll({ limit: 100 });
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xử lý images - nếu images rỗng nhưng có mainImage, chuyển mainImage vào images
    let imagesToSave = formData.images;
    if (imagesToSave.length === 0 && formData.mainImage) {
      imagesToSave = [formData.mainImage];
    }

    const productData = {
      ...formData,
      images: imagesToSave,
      sku: formData.sku ? formData.sku.trim() || null : null,
      stock: Number(formData.stock),
      pricing: {
        price6h: Number(formData.pricing.price6h) || 0,
        price12h: Number(formData.pricing.price12h) || 0,
        price1d: Number(formData.pricing.price1d) || 0,
        price2d: Number(formData.pricing.price2d) || 0,
        pricePerDay: Number(formData.pricing.pricePerDay) || 0
      }
    };

    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, productData);
      } else {
        await productApi.create(productData);
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi lưu sản phẩm!';
      alert(errorMsg);
    }
  };

  const handleEdit = (product) => {
    // Nếu có mainImage nhưng images rỗng, khôi phục images từ mainImage
    let images = product.images || [];
    if (images.length === 0 && product.mainImage) {
      images = [product.mainImage];
    }
    
    setEditingProduct(product);
    setFormData({
      id: product.id || product._id,
      name: product.name || '',
      sku: product.sku || '',
      brand: product.brand || 'Canon',
      category: product.category || 'Chuyên nghiệp',
      description: product.description || '',
      images: images,
      mainImage: product.mainImage || '',
      stock: product.stock ?? 1,
      isAvailable: product.isAvailable ?? true,
      isFeatured: product.isFeatured ?? false,
      isHot: product.isHot ?? false,
      isNew: product.isNew ?? false,
      pricing: {
        price6h: product.pricing?.price6h ?? product.pricing?.price3h ?? 0,
        price12h: product.pricing?.price12h ?? 0,
        price1d: product.pricing?.price1d ?? 0,
        price2d: product.pricing?.price2d ?? 0,
        pricePerDay: product.pricing?.pricePerDay ?? product.pricing?.price3dPlus ?? 0
      },
      sampleImages: product.sampleImages || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', sku: '', brand: 'Canon', category: 'Chuyên nghiệp',
      description: '', images: [], mainImage: '', stock: 1, isAvailable: true,
      isFeatured: false, isHot: false, isNew: false,
      pricing: { price6h: 0, price12h: 0, price1d: 0, price2d: 0, pricePerDay: 0 },
      sampleImages: []
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Hãng</th>
                <th className="px-4 py-3 text-center">Giá/ngày</th>
                <th className="px-4 py-3 text-center">Tồn kho</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={(() => {
                          const image = product.images?.[0] || product.mainImage;
                          return image?.startsWith('http') ? image : `${API_BASE}${image}`;
                        })() || 'https://via.placeholder.com/50'} 
                        className="w-12 h-12 rounded object-cover" 
                        alt="" 
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.sku || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{product.brand}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{(product.pricing?.price6h || 0).toLocaleString()}đ</td>
                  <td className="px-4 py-3 text-center">{product.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-2 font-medium">Sửa</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    placeholder="VD: Canon EOS R5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mã SKU</label>
                  <input 
                    type="text" 
                    value={formData.sku} 
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                    placeholder="VD: CANON-R5-001" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hãng</label>
                  <select 
                    value={formData.brand} 
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option>Canon</option>
                    <option>Sony</option>
                    <option>Fujifilm</option>
                    <option>Nikon</option>
                    <option>GoPro</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mục đích sử dụng</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Du lịch">Du lịch</option>
                    <option value="Vlog">Vlog</option>
                    <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                <MultiImageUpload
                  value={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={8}
                />
              </div>

              <div>
                <SampleImagesUpload
                  value={formData.sampleImages}
                  onChange={(images) => setFormData({ ...formData, sampleImages: images })}
                  maxImages={8}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={3} 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" 
                  placeholder="Mô tả chi tiết về sản phẩm..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Bảng giá thuê (VNĐ)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">6 tiếng</label>
                    <input
                      type="number"
                      value={formData.pricing.price6h}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, price6h: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">12 tiếng</label>
                    <input
                      type="number"
                      value={formData.pricing.price12h}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, price12h: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">1 ngày</label>
                    <input
                      type="number"
                      value={formData.pricing.price1d}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, price1d: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Giá 2 ngày *</label>
                    <input
                      type="number"
                      value={formData.pricing.price2d}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, price2d: e.target.value } })}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mỗi ngày thêm (từ ngày 3)</label>
                    <input
                      type="number"
                      value={formData.pricing.pricePerDay}
                      onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, pricePerDay: e.target.value } })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Ví dụ: Giá 2 ngày = 200, Mỗi ngày thêm = 50 → Thuê 5 ngày = 200 + 50 + 50 + 50 = 350đ
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isAvailable} 
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Còn hàng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured} 
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Nổi bật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isHot} 
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Hot</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isNew} 
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mới</span>
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
