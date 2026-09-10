import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Phone,
  MessageCircle,
  Tag,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Share2,
  Bookmark,
  Calendar,
  Zap,
  Sparkles,
} from 'lucide-react';
import { ProductItem, ProductCategory, Upazila, User } from '../types';
import { storageService } from '../services/storageService';
import { MonetizationModal } from './MonetizationModal';

interface Props {
  currentUser: User | null;
  selectedProduct?: ProductItem | null;
  onSelectProduct?: (p: ProductItem | null) => void;
  onOpenAuth: () => void;
  initialOpenPostAd?: boolean;
}

export const MarketplaceView: React.FC<Props> = ({
  currentUser,
  selectedProduct: initialSelected,
  onOpenAuth,
  initialOpenPostAd = false,
}) => {
  const [products, setProducts] = useState<ProductItem[]>(storageService.getProducts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('সকল উপজেলা');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(initialSelected || null);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(initialOpenPostAd);

  // Synchronize when parent requests opening ad modal
  React.useEffect(() => {
    if (initialOpenPostAd) {
      setIsPostAdModalOpen(true);
    }
  }, [initialOpenPostAd]);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [boostTargetProduct, setBoostTargetProduct] = useState<ProductItem | null>(null);

  // Form State for Post Ad
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Mobile');
  const [formPrice, setFormPrice] = useState('');
  const [formNegotiable, setFormNegotiable] = useState(true);
  const [formCondition, setFormCondition] = useState<'New' | 'Used'>('Used');
  const [formLocation, setFormLocation] = useState<Upazila>('জামালপুর সদর');
  const [formAddress, setFormAddress] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPhone, setFormPhone] = useState(currentUser?.phone || '');
  const [formSellerName, setFormSellerName] = useState(currentUser?.name || '');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'সব ক্যাটেগরি' },
    { id: 'Mobile', label: '📱 মোবাইল' },
    { id: 'Electronics', label: '💻 ইলেকট্রনিক্স' },
    { id: 'Clothing', label: '👗 পোশাক ও নকশী কাঁথা' },
    { id: 'Agricultural Products', label: '🌾 কৃষি পণ্য ও তেল' },
    { id: 'জমি/বাড়ি', label: '🏡 জমি / বাড়ি' },
    { id: 'যানবাহন', label: '🚗 যানবাহন ও বাইক' },
    { id: 'গৃহস্থালি পণ্য', label: '🛋️ গৃহস্থালি পণ্য' },
    { id: 'অন্যান্য', label: '📦 অন্যান্য' },
  ];

  const upazilas: Upazila[] = [
    'সকল উপজেলা',
    'জামালপুর সদর',
    'ইসলামপুর',
    'দেওয়ানগঞ্জ',
    'মেলান্দহ',
    'মাদারগঞ্জ',
    'সরিষাবাড়ী',
    'বকশীগঞ্জ',
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice) {
      alert('দয়া করে শিরোনাম এবং মূল্য পূরণ করুন');
      return;
    }

    const newProd = storageService.addProduct({
      title: formTitle.trim(),
      category: formCategory,
      price: Number(formPrice),
      isNegotiable: formNegotiable,
      location: formLocation,
      address: formAddress || formLocation,
      condition: formCondition,
      description: formDescription,
      images: [formImageUrl || imagePreview],
      sellerName: formSellerName || 'জামালপুর বিক্রেতা',
      sellerPhone: formPhone || '01700000000',
      sellerId: currentUser?.id || 'guest',
      featured: false,
    });

    setProducts(storageService.getProducts());
    setIsPostAdModalOpen(false);
    alert('বিজ্ঞাপনটি সফলভাবে পোস্ট হয়েছে!');
    setActiveModalProduct(newProd);

    // Reset Form
    setFormTitle('');
    setFormPrice('');
    setFormDescription('');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesUpazila = selectedUpazila === 'সকল উপজেলা' || p.location === selectedUpazila;
        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price <= maxPrice;
        return matchesCategory && matchesUpazila && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // default newest
      });
  }, [products, selectedCategory, selectedUpazila, searchQuery, maxPrice, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-xs font-bold bg-emerald-700/80 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-500/40">
            জামালপুর লোকাল মার্কেট
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            জামালপুর জেলার বিশ্বস্ত মার্কেটপ্লেস
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            মোবাইল, ইলেকট্রনিক্স, ঐতিহ্যবাহী নকশী কাঁথা, কৃষিজ পণ্য, যানবাহন ও জমি সরাসরি ক্রেতা-বিক্রেতার মধ্যে বেচাকেনা করুন।
          </p>
        </div>

        <button
          id="marketplace-post-ad-btn"
          onClick={() => setIsPostAdModalOpen(true)}
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>বিনামূল্যে বিজ্ঞাপন দিন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="marketplace-search-input"
              type="text"
              placeholder="পণ্য বা মডেলের নাম দিয়ে খুঁজুন (যেমন: স্যামসাং, নকশী কাঁথা, বাইক)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Upazila Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              id="marketplace-upazila-filter"
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value as Upazila)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer"
            >
              {upazilas.map((up) => (
                <option key={up} value={up}>
                  {up}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sorting & Result Counts */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>মোট <strong>{filteredProducts.length}</strong>টি বিজ্ঞাপন পাওয়া গেছে</span>
          <div className="flex items-center gap-2">
            <span>সর্ট করুন:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">সর্বশেষ প্রকাশিত</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">কোনো পণ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ দিয়ে চেষ্টা করুন।</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedUpazila('সকল উপজেলা');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 cursor-pointer"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              id={`marketplace-card-${p.id}`}
              onClick={() => setActiveModalProduct(p)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition duration-200 hover:-translate-y-1 cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {p.featured && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                    ফিচার্ড
                  </span>
                )}
                <span className="absolute top-2.5 right-2.5 bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {p.condition === 'New' ? 'নতুন' : 'ব্যবহৃত'}
                </span>
                <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{p.location}</span>
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-emerald-700">
                      ৳ {p.price.toLocaleString('bn-BD')}
                    </span>
                    {p.isNegotiable && (
                      <span className="text-[10px] text-slate-400 block font-normal">
                        (আলোচনা সাপেক্ষ)
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 group-hover:underline">
                    বিস্তারিত →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="relative h-64 sm:h-72 bg-slate-900">
              <img
                src={activeModalProduct.images[0]}
                alt={activeModalProduct.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {activeModalProduct.category}
                </span>
                <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-lg">
                  {activeModalProduct.condition === 'New' ? 'নতুন পণ্য' : 'ব্যবহৃত পণ্য'}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">বিজ্ঞাপনের তারিখ: {activeModalProduct.postedDate}</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    📍 {activeModalProduct.location}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {activeModalProduct.title}
                </h2>
                <div className="text-2xl font-black text-emerald-700 mt-2">
                  ৳ {activeModalProduct.price.toLocaleString('bn-BD')}{' '}
                  {activeModalProduct.isNegotiable && (
                    <span className="text-xs font-normal text-slate-500">(আলোচনা সাপেক্ষ)</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  পণ্যের বিস্তারিত বিবরণ
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeModalProduct.description}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                  ঠিকানা: <strong>{activeModalProduct.address}</strong>
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    বিক্রেতার তথ্য
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-0.5">
                    {activeModalProduct.sellerName}
                  </h4>
                  <p className="text-xs text-emerald-700 font-mono mt-0.5">
                    মোবাইল: {activeModalProduct.sellerPhone}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    id="call-seller-btn"
                    href={`tel:${activeModalProduct.sellerPhone}`}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>কল করুন</span>
                  </a>
                  <a
                    id="whatsapp-seller-btn"
                    href={`https://wa.me/88${activeModalProduct.sellerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setBoostTargetProduct(activeModalProduct);
                  setBoostModalOpen(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>🚀 দ্রুত বিক্রি করতে বুস্ট করুন (৳৫০)</span>
              </button>

              <button
                onClick={() => setActiveModalProduct(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monetization Modal for Boosting */}
      <MonetizationModal
        isOpen={boostModalOpen}
        onClose={() => {
          setBoostModalOpen(false);
          setBoostTargetProduct(null);
          setProducts(storageService.getProducts());
        }}
        defaultService="boost_product"
        targetId={boostTargetProduct?.id}
        targetTitle={boostTargetProduct?.title}
      />

      {/* Post Ad Modal */}
      {isPostAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-lg">মার্কেটপ্লেসে বিজ্ঞাপন পোস্ট করুন</h3>
              </div>
              <button
                onClick={() => setIsPostAdModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostAd} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বিজ্ঞাপনের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: iPhone 13 128GB অথবা আসল নকশী কাঁথা"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটেগরি *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Agricultural Products">Agricultural Products</option>
                    <option value="জমি/বাড়ি">জমি/বাড়ি</option>
                    <option value="যানবাহন">যানবাহন</option>
                    <option value="গৃহস্থালি পণ্য">গৃহস্থালি পণ্য</option>
                    <option value="চাকরি">চাকরি</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কন্ডিশন</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Used">ব্যবহৃত (Used)</option>
                    <option value="New">সম্পূর্ণ নতুন (New)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মূল্য (টাকায়) *</label>
                  <input
                    type="number"
                    required
                    placeholder="৳"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-6 gap-2">
                  <input
                    type="checkbox"
                    id="negotiable-check"
                    checked={formNegotiable}
                    onChange={(e) => setFormNegotiable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="negotiable-check" className="font-semibold text-slate-700 text-xs cursor-pointer">
                    দাম আলোচনা সাপেক্ষ
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপজেলা *</label>
                  <select
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value as Upazila)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="জামালপুর সদর">জামালপুর সদর</option>
                    <option value="ইসলামপুর">ইসলামপুর</option>
                    <option value="মেলান্দহ">মেলান্দহ</option>
                    <option value="দেওয়ানগঞ্জ">দেওয়ানগঞ্জ</option>
                    <option value="মাদারগঞ্জ">মাদারগঞ্জ</option>
                    <option value="সরিষাবাড়ী">সরিষাবাড়ী</option>
                    <option value="বকশীগঞ্জ">বকশীগঞ্জ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">নির্দিষ্ট এলাকা / বাজার</label>
                  <input
                    type="text"
                    placeholder="যেমন: স্টেশন মোড়, বড় বাজার"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Image Upload & Live Preview System */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পণ্যের ছবি (Image Upload / Preview System)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="অথবা ছবির অনলাইন URL দিন"
                      value={formImageUrl}
                      onChange={(e) => {
                        setFormImageUrl(e.target.value);
                        if (e.target.value) setImagePreview(e.target.value);
                      }}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পণ্যের বিস্তারিত বিবরণ *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন (কন্ডিশন, ব্যবহারকাল, কেন বিক্রি করছেন ইত্যাদি)..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="নাম"
                    value={formSellerName}
                    onChange={(e) => setFormSellerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostAdModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition"
                >
                  বিজ্ঞাপন প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
