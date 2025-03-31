import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
import  { Button } from '@mui/material';
import { Input } from '@mui/material';
import { Label } from '@mui/material';
import {ImageUpload }from '@mui/material';

const ProductTypeForm = ({ onAddProductType }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);

  const onSubmit = (data) => {
    if (!image) {
      alert('Please upload an image');
      return;
    }
    onAddProductType({ ...data, image });
    reset();
    setImage(null);
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Add New Product Type</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Type Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Product type name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        
        <ImageUpload onImageUpload={setImage} />
        
        <Button type="submit" className="w-full">
          Add Product Type
        </Button>
      </form>
    </div>
  );
};

export default ProductTypeForm;