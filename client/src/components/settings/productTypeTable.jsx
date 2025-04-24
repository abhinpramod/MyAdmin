import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Button } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
// import Image from 'next/image';

const ProductTypeTable = ({ productTypes, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {productTypes.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                {product.image && (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={50} 
                    height={50} 
                    className="rounded-md"
                  />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onEdit(product._id, product.name, null)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => onDelete(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTypeTable;