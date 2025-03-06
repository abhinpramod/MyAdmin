import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { User, ShoppingCart, DollarSign } from 'lucide-react';

// Mock data for the chart
const chartData = [
  { name: 'January', sales: 65 },
  { name: 'February', sales: 59 },
  { name: 'March', sales: 80 },
  { name: 'April', sales: 81 },
  { name: 'May', sales: 56 },
  { name: 'June', sales: 55 },
  { name: 'July', sales: 40 },
];

// Mock data for the table
const tableData = [
  { id: 1, name: 'John Doe', age: 28, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
  { id: 3, name: 'Sam Green', age: 45, city: 'Chicago' },
  { id:4,name: 'John Doe', age: 28, city: 'New York' },
  { id: 5,name: 'Jane Smith', age: 34, city: 'Los Angeles' },
  { id: 6,name: 'Sam Green', age: 45, city: 'Chicago' },
  { id: 7, name: 'John Doe', age: 28, city: 'New York' },
  { id: 8, name: 'Jane Smith', age: 34, city: 'Los Angeles' },
  { id: 9, name: 'Sam Green', age: 45, city: 'Chicago' },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '' }}>
      <Typography variant="h4" gutterBottom color="oklch(0.129 0.042 264.695)">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Chart Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="">
                Sales Overview
              </Typography>
              <BarChart
                width={700}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="oklch(0.488 0.243 264.376)" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <DollarSign size={24} style={{ marginRight: 6   , color: 'oklch(0.553 0.013 58.071)' }} />
                    <Typography variant="h6" color="oklch(0.446 0.03 256.802)">Total Sales</Typography>
                  </Box>
                  <Typography variant="h4" color="">&nbsp; $12,345</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <User size={24} style={{ marginRight: 8, color: 'oklch(0.553 0.013 58.071)' }} />
                    <Typography variant="h6" color="oklch(0.446 0.03 256.802)">Total Users</Typography>
                  </Box>
                  <Typography variant="h4" color="">1,234</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <ShoppingCart size={24} style={{ marginRight: 8, color: 'oklch(0.553 0.013 58.071)' }} />
                    <Typography variant="h6" color="oklch(0.446 0.03 256.802)">Total Orders</Typography>
                  </Box>
                  <Typography variant="h4" color="">567</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Table Card */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.dark">
                User Data
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '', color: '' }}>
                      <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Age</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td style={{ alignContent: 'center', borderBottom: '1px solid #ddd' }}>{row.id}</td>
                        <td style={{ alignContent: 'center', borderBottom: '1px solid #ddd' }}>{row.name}</td>
                        <td style={{ alignContent: 'center', borderBottom: '1px solid #ddd' }}>{row.age}</td>
                        <td style={{ alignContent: 'center', borderBottom: '1px solid #ddd' }}>{row.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
