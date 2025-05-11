'use client';

import { useState } from 'react';
import { Banner } from 'src/components/Banner';
import Navbar from 'src/components/Navbar';
import Link from 'next/link';
import { Package, ChevronRight, Search, Filter } from 'lucide-react';

// Mock order data - in a real app, these would come from an API
const orders = [
  {
    id: 'ORD12345',
    date: '2023-05-15',
    total: 79.98,
    status: 'delivered',
    items: [
      { id: 'prod1', name: 'T-Shirt', quantity: 2, price: 24.99, image: 'https://placehold.co/100x100?text=T-Shirt' },
      { id: 'prod2', name: 'Hoodie', quantity: 1, price: 29.99, image: 'https://placehold.co/100x100?text=Hoodie' },
    ],
    trackingNumber: '1Z999AA10123456784',
  },
  {
    id: 'ORD12346',
    date: '2023-06-20',
    total: 149.99,
    status: 'processing',
    items: [
      { id: 'prod3', name: 'Sneakers', quantity: 1, price: 149.99, image: 'https://placehold.co/100x100?text=Sneakers' },
    ],
    trackingNumber: null,
  },
  {
    id: 'ORD12347',
    date: '2023-07-10',
    total: 34.99,
    status: 'shipped',
    items: [
      { id: 'prod4', name: 'Backpack', quantity: 1, price: 34.99, image: 'https://placehold.co/100x100?text=Backpack' },
    ],
    trackingNumber: '1Z999AA10123456792',
  },
];

// Order status badge mapping
const statusBadges = {
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get detailed order when selected
  const orderDetails = selectedOrder 
    ? orders.find(order => order.id === selectedOrder) 
    : null;
  
  return (
    <div className="flex min-h-screen flex-col font-sansMono">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-24">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Link
            href="/account"
            className="mt-2 text-sm text-gray-600 hover:text-gray-900 sm:mt-0"
          >
            ← Back to Account
          </Link>
        </div>
        
        {/* Search and filter */}
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        
        {selectedOrder ? (
          // Order Details View
          <div>
            <div className="mb-6 flex items-center">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedOrder(null)}
              >
                ← Back to Orders
              </button>
              <h2 className="ml-4 text-xl font-medium">Order {orderDetails?.id}</h2>
            </div>
            
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Placed on</p>
                    <p className="font-medium">
                      {new Date(orderDetails?.date || '').toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      statusBadges[orderDetails?.status as keyof typeof statusBadges]
                    }`}>
                      {orderDetails?.status.charAt(0).toUpperCase() + orderDetails?.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {orderDetails?.trackingNumber && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium">{orderDetails.trackingNumber}</p>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
              <div className="divide-y divide-gray-200">
                {orderDetails?.items.map((item) => (
                  <div key={item.id} className="flex items-center p-4 sm:p-6">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${orderDetails?.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Orders List View
          <div>
            {filteredOrders.length > 0 ? (
              <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 sm:px-6"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <Package size={20} />
                      </div>
                      
                      <div>
                        <p className="font-medium">Order {order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} · ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`mr-4 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        statusBadges[order.status as keyof typeof statusBadges]
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 py-16 text-center">
                <Package size={48} className="mb-4 text-gray-300" />
                <h2 className="mb-1 text-xl font-medium">No orders found</h2>
                <p className="mb-6 text-gray-500">
                  {searchTerm 
                    ? `No orders match "${searchTerm}"`
                    : "You haven't placed any orders yet"}
                </p>
                <Link
                  href="/"
                  className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 