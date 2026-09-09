import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Discounts from './pages/Discounts';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Login from './pages/Login';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/products"
        element={
          <AdminLayout>
            <Products />
          </AdminLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <AdminLayout>
            <Orders />
          </AdminLayout>
        }
      />
      <Route
        path="/inventory"
        element={
          <AdminLayout>
            <Inventory />
          </AdminLayout>
        }
      />
      <Route
        path="/customers"
        element={
          <AdminLayout>
            <Customers />
          </AdminLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <AdminLayout>
            <Categories />
          </AdminLayout>
        }
      />
      <Route
        path="/discounts"
        element={
          <AdminLayout>
            <Discounts />
          </AdminLayout>
        }
      />
      <Route
        path="/reviews"
        element={
          <AdminLayout>
            <Reviews />
          </AdminLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminLayout>
            <Settings />
          </AdminLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
