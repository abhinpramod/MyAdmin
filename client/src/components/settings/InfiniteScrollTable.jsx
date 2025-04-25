// components/tables/InfiniteScrollTable.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { Search } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from '../../hooks/useDebounce';

const InfiniteScrollTable = ({ 
  data,
  columns,
  fetchMoreData,
  hasMore,
  searchTerm,
  setSearchTerm,
  isLoading,
  height = 500,
  noDataMessage = 'No data found',
  endMessage = 'No more data to load'
}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchMoreData(1, true, debouncedSearchTerm);
    } else if (searchTerm === '') {
      fetchMoreData(1, true, '');
    }
  }, [debouncedSearchTerm]);

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        placeholder="Search..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
        disabled={isLoading}
      />
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          if (searchTerm === '') {
            fetchMoreData(null, false, '');
          }
        }}
        hasMore={hasMore && searchTerm === ''}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
        endMessage={
          <Typography variant="body2" align="center" sx={{ p: 2 }}>
            {data.length === 0 ? noDataMessage : 
             searchTerm ? 'End of search results' : endMessage}
          </Typography>
        }
        height={height}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row._id || rowIndex} hover>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </TableContainer>
  );
};

export default InfiniteScrollTable;