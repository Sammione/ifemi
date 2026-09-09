import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductItem,
  OrderRecord,
  CustomerRecord,
  CategoryItem,
  PromoCode,
  ReviewItem,
  StoreSettings,
  initialProducts,
  initialOrders,
  initialCustomers,
  initialCategories,
  initialPromos,
  initialReviews,
  initialSettings
} from '../data/mockData';

interface AdminContextType {
  products: ProductItem[];
  orders: OrderRecord[];
  customers: CustomerRecord[];
  categories: CategoryItem[];
  promos: PromoCode[];
  reviews: ReviewItem[];
  settings: StoreSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  // Product actions
  addProduct: (product: Omit<ProductItem, 'id' | 'salesCount'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<ProductItem>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (id: string, delta: number) => Promise<void>;
  // Order actions
  updateOrderStatus: (id: string, status: OrderRecord['orderStatus']) => Promise<void>;
  updateOrderTracking: (id: string, courier: string, trackingNumber: string) => Promise<void>;
  // Category actions
  addCategory: (category: Omit<CategoryItem, 'id' | 'productsCount'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategoryFeatured: (id: string) => void;
  // Promo actions
  addPromo: (promo: Omit<PromoCode, 'id' | 'usedCount'>) => void;
  togglePromoActive: (id: string) => void;
  deletePromo: (id: string) => void;
  // Review actions
  updateReviewStatus: (id: string, status: ReviewItem['status']) => void;
  deleteReview: (id: string) => void;
  // Settings action
  updateSettings: (newSettings: StoreSettings) => void;
  currency: 'NGN' | 'GBP';
  setCurrency: (currency: 'NGN' | 'GBP') => void;
  // Currency helper
  formatCurrency: (amount: number, currency?: 'NGN' | 'GBP') => string;
}

const AdminDataContext = createContext<AdminContextType | null>(null);

const STORAGE_KEY = 'ifemi_admin_data_v1';

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_promos`);
    return saved ? JSON.parse(saved) : initialPromos;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Fetch initial data from Backend API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, orderRes, catRes] = await Promise.allSettled([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/categories')
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const prodData = await prodRes.value.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          // Normalize colors/sizes if needed
          const normalized = prodData.map((p: any) => ({
            ...p,
            colors: Array.isArray(p.colors)
              ? p.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#0B132B', bgClass: 'bg-[#0B132B]' } : c)
              : [],
            sizes: Array.isArray(p.sizes) ? p.sizes : ['One Size']
          }));
          setProducts(normalized);
        }
      }

      if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
        const orderData = await orderRes.value.json();
        if (Array.isArray(orderData)) {
          setOrders(orderData);
        }
      }

      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catData = await catRes.value.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        }
      }
    } catch (e) {
      console.warn('API sync failed, using cached local data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_promos`, JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  // Product mutations (Synced with API)
  const addProduct = async (productData: Omit<ProductItem, 'id' | 'salesCount'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        return;
      }
    } catch (e) {
      console.warn('POST /api/products failed, using local fallback', e);
    }

    // Local fallback
    const newProduct: ProductItem = {
      ...productData,
      id: String(Date.now()),
      salesCount: 0
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = async (id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.warn('PUT /api/products failed:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('DELETE /api/products failed:', e);
    }
  };

  const adjustStock = async (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );

    try {
      await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
    } catch (e) {
      console.warn('PATCH stock failed:', e);
    }
  };

  // Order mutations (Synced with API)
  const updateOrderStatus = async (id: string, status: OrderRecord['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );

    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.warn('PATCH order status failed:', e);
    }
  };

  const updateOrderTracking = async (id: string, courier: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, courier, trackingNumber, deliveryStatus: `Dispatched with ${courier} (${trackingNumber})`, updatedAt: new Date().toISOString() }
          : o
      )
    );

    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier, trackingNumber })
      });
    } catch (e) {
      console.warn('PATCH order tracking failed:', e);
    }
  };

  // Category mutations
  const addCategory = async (catData: Omit<CategoryItem, 'id' | 'productsCount'>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        return;
      }
    } catch (e) {
      console.warn('POST /api/categories failed:', e);
    }

    const newCat: CategoryItem = {
      ...catData,
      id: `cat-${Date.now()}`,
      productsCount: 0
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('DELETE category failed:', e);
    }
  };

  const toggleCategoryFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
  };

  // Promos
  const addPromo = (promoData: Omit<PromoCode, 'id' | 'usedCount'>) => {
    const newPromo: PromoCode = {
      ...promoData,
      id: `promo-${Date.now()}`,
      usedCount: 0
    };
    setPromos((prev) => [newPromo, ...prev]);
  };

  const togglePromoActive = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  // Reviews
  const updateReviewStatus = (id: string, status: ReviewItem['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Settings & Currency
  const currency: 'NGN' | 'GBP' = settings.currency || 'NGN';
  const setCurrency = (newCurrency: 'NGN' | 'GBP') => {
    const updated = { ...settings, currency: newCurrency };
    setSettings(updated);
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(updated));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(newSettings));
  };

  // Dynamic Currency helper respecting active settings.currency
  const formatCurrency = (amount: number, overrideCurrency?: 'NGN' | 'GBP') => {
    const activeCurrency = overrideCurrency || settings.currency || 'NGN';
    const num = Number(amount) || 0;

    if (activeCurrency === 'GBP') {
      // If amount was stored in base NGN (e.g. order revenue, inventory valuation, or default prices)
      const gbpAmount = (!overrideCurrency && num > 500) ? Math.round((num / 1600) * 100) / 100 : num;
      return `£${gbpAmount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return `₦${num.toLocaleString('en-NG')}`;
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        customers,
        categories,
        promos,
        reviews,
        settings,
        currency,
        setCurrency,
        isLoading,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        updateOrderStatus,
        updateOrderTracking,
        addCategory,
        deleteCategory,
        toggleCategoryFeatured,
        addPromo,
        togglePromoActive,
        deletePromo,
        updateReviewStatus,
        deleteReview,
        updateSettings,
        formatCurrency
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
