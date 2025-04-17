// components/store.components/AdminStoreProfile.jsx
import React from "react";
import { useState, useEffect } from "react";
import {
  Grid,
  Divider,
  Box,
  CircularProgress,
  Typography,
  IconButton
} from "@mui/material";
import { X } from 'lucide-react';
import axios from '../../lib/aixos';
import { toast } from 'react-hot-toast';
import StoreHeader from './StoreHeader';
import StoreDetails from './StoreDetails';
import ProductCard from '../products/ProductCard';
import ProductDetailDialog from '../products/ProductDetailDialog';

const AdminStoreProfile = ({ storeId, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch store data and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch store data
        const storeResponse = await axios.get(`/stores/${storeId}`);
        setStoreData(storeResponse.data);

        // Fetch products
        const productsResponse = await axios.get(`/stores/${storeId}/products`);
        console.log(productsResponse.data);
        setProducts(productsResponse.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!storeData) {
    return <Typography>Store not found</Typography>;
  }

  return (
    <Box className="p-4 md:p-6">
      <Box className="flex justify-end mb-4">
        <IconButton 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </IconButton>
      </Box>

      {/* Store Header Section */}
      <Box className="flex flex-col md:flex-row gap-6 mb-8">
        <StoreHeader
          storeData={storeData}
          isOwnerView={false}
        />

        <StoreDetails storeData={storeData} />
      </Box>

      <Divider className="my-6" />

      {/* Products Section */}
      <Box className="mb-8">
        <Typography variant="h6" className="font-semibold mb-4">
          Our Products
        </Typography>
        
        {products.length === 0 ? (
          <Typography>No products available</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  onClick={() => setSelectedProduct(product)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
        }}
        isOwnerView={false}
      />
    </Box>
  );
};
 
export default AdminStoreProfile;