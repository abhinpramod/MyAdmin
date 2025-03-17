import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Pencil, Trash, Upload } from 'lucide-react';

const JobTypeTable = ({ jobTypes, onEdit, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedImage(null);
  };

  return (
    <TableContainer component={Paper} className="shadow-sm border border-gray-200">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="font-bold text-gray-900"><strong>Job Type</strong></TableCell>
            <TableCell className="font-bold text-gray-900" align="center"><strong>Image</strong></TableCell>
            <TableCell className="font-bold text-gray-900" align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(jobTypes) && jobTypes.length > 0 ? (
            jobTypes.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-gray-900 font-bold">
                  {editingId === job._id ? (
                    <TextField
                      defaultValue={job.name}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    job.name
                  )}
                </TableCell>
                <TableCell align="center">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.name}
                      className="w-30 h-30 object-cover mx-auto border-2 border-gray-200"
                    />
                  ) : (
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                  )}
                  {editingId === job._id && (
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) => setSelectedImage({ id: job._id, file: e.target.files[0] })}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingId === job._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => onUpdate(job._id, editingName, selectedImage)}
                        className="bg-gray-900 text-white hover:bg-gray-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="text-gray-900 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <IconButton
                        onClick={() => handleEdit(job._id, job.name)}
                        className="text-gray-900 hover:bg-gray-200 rounded-full p-2"
                      >
                        <Pencil className="w-7 h-7 text-gray-800" />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(job._id)}
                        className="text-gray-900 hover:bg-gray-200 rounded-full p-2"
                      >
                        <Trash className="w-7 h-7 text-gray-800" />
                      </IconButton>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" className="text-gray-500 py-6">
                No job types found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobTypeTable;