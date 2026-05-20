import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  Tooltip, Card, CardContent, Grid, Divider, Badge, Tabs, Tab
} from '@mui/material';
import {
  Visibility, CheckCircle, Cancel, Refresh, Payment,
  Info, QrCode2, AccountBalance, CopyAll, Notifications
} from '@mui/icons-material';
import { paymentApi, adminBookingApi } from '../../api/endpoints';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [vietqrPayments, setVietqrPayments] = useState([]);
  const [processedPayments, setProcessedPayments] = useState([]);
  const [vietqrTab, setVietqrTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [vietqrLoading, setVietqrLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [stats, setStats] = useState({ totalCompleted: 0, totalAmount: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchVietqrPayments();
  }, [pagination.page, filterStatus, filterMethod]);

  // SSE for real-time payment updates (from Telegram)
  useEffect(() => {
    let eventSource = null;

    const connectSSE = () => {
      eventSource = new EventSource(`${API_URL}/sse/payments`);

      eventSource.onopen = () => {
        console.log('[SSE] Connected to payment updates');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[SSE] Payment update received:', data);

          if (data.type === 'vietqr_update') {
            // Refresh both payment lists
            fetchPayments();
            fetchVietqrPayments();
          }
        } catch (error) {
          console.error('[SSE] Parse error:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('[SSE] Connection error:', error);
        eventSource.close();
        // Reconnect after 5 seconds
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('[SSE] Disconnected');
      }
    };
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filterStatus && { status: filterStatus }),
        ...(filterMethod && { paymentMethod: filterMethod })
      };

      const response = await paymentApi.getAllPayments(params);

      if (response.success) {
        setPayments(response.data.payments || []);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVietqrPayments = useCallback(async (silent = false) => {
    try {
      if (!silent) setVietqrLoading(true);

      // Fetch all VietQR payments (all statuses)
      const response = await paymentApi.getAllVietQRPayments({ limit: 100 });

      if (response.success) {
        const allPayments = response.data.payments || [];

        // Enrich with booking info
        const enrichedPayments = allPayments.map(payment => ({
          ...payment,
          bookingInfo: payment.booking ? {
            id: payment.booking._id || payment.booking,
            customerName: payment.booking.customerName || payment.booking.customer?.name || 'N/A',
            customerPhone: payment.booking.customerPhone || payment.booking.customer?.phone || 'N/A',
            productName: payment.booking.productId?.name || payment.booking.product?.name || 'N/A'
          } : null
        }));

        setVietqrPayments(enrichedPayments.filter(p => p.status === 'pending'));
        setProcessedPayments(enrichedPayments.filter(p => p.status !== 'pending'));
      }
    } catch (error) {
      console.error('Error fetching VietQR payments:', error);
    } finally {
      if (!silent) setVietqrLoading(false);
    }
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleViewDetail = async (paymentId) => {
    try {
      const response = await paymentApi.getPaymentInfo(paymentId);
      if (response.success) {
        setSelectedPayment(response.data);
        setDetailDialog(true);
      }
    } catch (error) {
      showAlert('error', 'Lỗi khi tải thông tin thanh toán');
    }
  };

  const handleConfirmPayment = async () => {
    try {
      console.log('[DEBUG] selectedPayment:', selectedPayment);
      console.log('[DEBUG] selectedPayment._id:', selectedPayment?._id);
      console.log('[DEBUG] selectedPayment.id:', selectedPayment?.id);
      
      setConfirming(true);
      
      // VietQR payments have bankName and transferContent
      const isVietQR = selectedPayment?.bankName && selectedPayment?.transferContent;
      
      const paymentId = selectedPayment?._id || selectedPayment?.id;
      console.log('[DEBUG] Payment ID to use:', paymentId);
      
      let response;
      if (isVietQR) {
        console.log('[DEBUG] Calling adminConfirmPayment');
        response = await paymentApi.adminConfirmPayment(paymentId, notes);
        console.log('[DEBUG] VietQR response:', response);
      } else {
        console.log('[DEBUG] Calling confirmPayment');
        response = await paymentApi.confirmPayment(paymentId, notes);
        console.log('[DEBUG] Regular response:', response);
      }

      console.log('[DEBUG] Response success:', response?.success, 'Response:', response);

      if (response?.success) {
        showAlert('success', 'Xác nhận thanh toán thành công! Thông báo Telegram đã được gửi.');
        setConfirmDialog(false);
        setNotes('');
        setDetailDialog(false);
        fetchPayments();
        fetchVietqrPayments();
      } else {
        showAlert('error', response.message || 'Lỗi xác nhận thanh toán');
      }
    } catch (error) {
      console.error('[DEBUG] Confirm error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Lỗi xác nhận thanh toán';
      showAlert('error', errorMsg);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelPayment = async () => {
    try {
      console.log('[DEBUG] Cancel - selectedPayment:', selectedPayment);
      
      // VietQR payments have bankName and transferContent
      const isVietQR = selectedPayment?.bankName && selectedPayment?.transferContent;
      
      const paymentId = selectedPayment?._id || selectedPayment?.id;
      console.log('[DEBUG] Cancel - Payment ID:', paymentId, 'isVietQR:', isVietQR);
      
      let response;
      if (isVietQR) {
        console.log('[DEBUG] Calling adminCancelPayment');
        response = await paymentApi.adminCancelPayment(paymentId, notes);
        console.log('[DEBUG] Cancel VietQR response:', response);
      } else {
        console.log('[DEBUG] Calling cancelPayment');
        response = await paymentApi.cancelPayment(paymentId, notes);
        console.log('[DEBUG] Cancel regular response:', response);
      }

      console.log('[DEBUG] Cancel Response success:', response?.success, 'Response:', response);

      if (response?.success) {
        showAlert('success', 'Hủy thanh toán thành công');
        setCancelDialog(false);
        setNotes('');
        setDetailDialog(false);
        fetchPayments();
        fetchVietqrPayments();
      } else {
        showAlert('error', response?.message || 'Lỗi hủy thanh toán');
      }
    } catch (error) {
      console.error('[DEBUG] Cancel error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Lỗi hủy thanh toán';
      showAlert('error', errorMsg);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('success', 'Đã sao chép!');
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Chờ xử lý' },
      processing: { color: 'info', label: 'Đang xử lý' },
      completed: { color: 'success', label: 'Hoàn thành' },
      failed: { color: 'error', label: 'Thất bại' },
      cancelled: { color: 'default', label: 'Đã hủy' }
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getMethodChip = (method) => {
    const methodConfig = {
      acb_qr: { color: 'primary', label: 'ACB QR' },
      cod: { color: 'warning', label: 'COD' },
      vnpay: { color: 'error', label: 'VNPay' },
      vietqr: { color: 'success', label: 'VietQR' }
    };
    const config = methodConfig[method] || { color: 'default', label: method };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const pendingVietqrCount = vietqrPayments.length;
  const completedCount = processedPayments.filter(p => p.status === 'completed').length;
  const cancelledCount = processedPayments.filter(p => p.status === 'cancelled').length;

  // Helper to render VietQR payment card
  const renderVietqrCard = (payment, showActions = false) => (
    <Grid item xs={12} sm={6} md={4} key={payment.id || payment._id}>
      <Card sx={{ bgcolor: 'grey.900', height: '100%', border: '1px solid', borderColor: getStatusBorderColor(payment.status) }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                #{payment.id?.toString().slice(-8).toUpperCase() || payment._id?.toString().slice(-8).toUpperCase()}
              </Typography>
              {payment.bookingInfo && (
                <Typography variant="body2" color="success.light" sx={{ fontWeight: 'bold' }}>
                  {payment.bookingInfo.customerName}
                </Typography>
              )}
            </Box>
            {getStatusChip(payment.status)}
          </Box>

          <Typography variant="h4" color={payment.status === 'cancelled' ? 'error.main' : 'success.main'} fontWeight="bold" gutterBottom>
            {formatCurrency(payment.amount)}
          </Typography>

          {payment.bookingInfo && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                📱 {payment.bookingInfo.customerPhone}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                📷 {payment.bookingInfo.productName}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <AccountBalance sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {payment.bankName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              CK: <strong>{payment.transferContent}</strong>
            </Typography>
            <IconButton size="small" onClick={() => copyToClipboard(payment.transferContent)}>
              <CopyAll sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {formatDate(payment.createdAt)}
          </Typography>

          {payment.cancellationReason && (
            <Alert severity="error" sx={{ mt: 1, py: 0 }}>
              <Typography variant="caption">Lý do hủy: {payment.cancellationReason}</Typography>
            </Alert>
          )}

          {payment.notes && payment.status === 'completed' && (
            <Alert severity="success" sx={{ mt: 1, py: 0 }}>
              <Typography variant="caption">Ghi chú: {payment.notes}</Typography>
            </Alert>
          )}

          {showActions && payment.status === 'pending' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={() => {
                  setSelectedPayment(payment);
                  setConfirmDialog(true);
                }}
              >
                Xác nhận
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  setSelectedPayment(payment);
                  setCancelDialog(true);
                }}
              >
                Hủy
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: showActions && payment.status === 'pending' ? 1 : 2 }}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              fullWidth
              onClick={() => handleViewDetail(payment.id || payment._id)}
            >
              Chi tiết
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'completed': return 'success.main';
      case 'cancelled': return 'error.main';
      default: return 'success.main';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {alert.show && (
        <Alert severity={alert.type} onClose={() => setAlert({ show: false })} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Paper sx={{ p: 3, flex: 1, bgcolor: 'success.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Payment sx={{ fontSize: 40, color: 'success.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Tổng doanh thu</Typography>
              <Typography variant="h5" fontWeight="bold">{formatCurrency(stats.totalAmount)}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, bgcolor: 'info.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 40, color: 'info.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Thanh toán thành công</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.totalCompleted}</Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, bgcolor: 'warning.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Info sx={{ fontSize: 40, color: 'warning.main' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Đang chờ xử lý</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.pendingPayments || 0}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* VietQR Payments Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'green.dark', border: '2px solid', borderColor: 'success.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QrCode2 sx={{ fontSize: 40, color: 'success.light' }} />
            <Box>
              <Typography variant="h6" color="white" fontWeight="bold">
                Quản lý thanh toán VietQR
              </Typography>
              <Typography variant="body2" color="green.200">
                Xem và xử lý thanh toán VietQR
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<Refresh />}
            onClick={() => fetchVietqrPayments()}
            disabled={vietqrLoading}
          >
            {vietqrLoading ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={vietqrTab} 
            onChange={(e, v) => setVietqrTab(v)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab 
              value="pending" 
              label={
                <Badge badgeContent={pendingVietqrCount} color="error">
                  <span>Chờ xác nhận</span>
                </Badge>
              } 
            />
            <Tab 
              value="completed" 
              label={
                <Badge badgeContent={completedCount} color="success">
                  <span>Đã xác nhận</span>
                </Badge>
              } 
            />
            <Tab 
              value="cancelled" 
              label={
                <Badge badgeContent={cancelledCount} color="default">
                  <span>Đã hủy</span>
                </Badge>
              } 
            />
          </Tabs>
        </Box>

        {/* Pending Tab */}
        {vietqrTab === 'pending' && (
          <>
            {pendingVietqrCount > 0 ? (
              <Grid container spacing={2}>
                {vietqrPayments.map(payment => renderVietqrCard(payment, true))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
                <Typography color="green.200">
                  Không có thanh toán chờ xác nhận!
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Completed Tab */}
        {vietqrTab === 'completed' && (
          <>
            {completedCount > 0 ? (
              <Grid container spacing={2}>
                {processedPayments.filter(p => p.status === 'completed').map(payment => renderVietqrCard(payment, false))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="green.200">
                  Chưa có thanh toán nào được xác nhận
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Cancelled Tab */}
        {vietqrTab === 'cancelled' && (
          <>
            {cancelledCount > 0 ? (
              <Grid container spacing={2}>
                {processedPayments.filter(p => p.status === 'cancelled').map(payment => renderVietqrCard(payment, false))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="green.200">
                  Không có thanh toán nào bị hủy
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="failed">Thất bại</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Phương thức</InputLabel>
            <Select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              label="Phương thức"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="acb_qr">ACB QR</MenuItem>
              <MenuItem value="cod">COD</MenuItem>
              <MenuItem value="vnpay">VNPay</MenuItem>
              <MenuItem value="vietqr">VietQR</MenuItem>
            </Select>
          </FormControl>
          <Button startIcon={<Refresh />} onClick={fetchPayments} variant="outlined">
            Làm mới
          </Button>
        </Box>
      </Paper>

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell><strong>Mã GD</strong></TableCell>
              <TableCell><strong>Khách hàng</strong></TableCell>
              <TableCell><strong>Số tiền</strong></TableCell>
              <TableCell><strong>Phương thức</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có thanh toán nào</Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {payment.transactionId?.slice(0, 15) || 'N/A'}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payment.userId?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.userId?.email || payment.userId?.phone || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getMethodChip(payment.paymentMethod)}</TableCell>
                  <TableCell>{getStatusChip(payment.status)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(payment.createdAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small" onClick={() => handleViewDetail(payment._id)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {payment.status === 'pending' && (
                      <>
                        <Tooltip title="Xác nhận đã thanh toán">
                          <IconButton size="small" color="success" onClick={() => {
                            setSelectedPayment(payment);
                            setConfirmDialog(true);
                          }}>
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy thanh toán">
                          <IconButton size="small" color="error" onClick={() => {
                            setSelectedPayment(payment);
                            setCancelDialog(true);
                          }}>
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
        <Button
          disabled={pagination.page === 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          variant="outlined"
        >
          Trước
        </Button>
        <Typography sx={{ pt: 1 }}>
          Trang {pagination.page} / {pagination.pages || 1} - Tổng: {pagination.total}
        </Typography>
        <Button
          disabled={pagination.page >= pagination.pages}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          variant="outlined"
        >
          Sau
        </Button>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết thanh toán</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">Mã giao dịch</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                {selectedPayment.payment?.transactionId || 'N/A'}
              </Typography>

              {/* Booking Info */}
              {selectedPayment.bookingInfo && (
                <>
                  <Typography variant="body2" color="text.secondary">Thông tin đơn hàng</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2"><strong>Khách hàng:</strong> {selectedPayment.bookingInfo.customerName}</Typography>
                    <Typography variant="body2"><strong>SĐT:</strong> {selectedPayment.bookingInfo.customerPhone}</Typography>
                    <Typography variant="body2"><strong>Sản phẩm:</strong> {selectedPayment.bookingInfo.productName}</Typography>
                  </Paper>
                </>
              )}

              <Typography variant="body2" color="text.secondary">Số tiền</Typography>
              <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                {formatCurrency(selectedPayment.payment?.amount)}
              </Typography>

              <Typography variant="body2" color="text.secondary">Phương thức</Typography>
              <Box sx={{ mb: 2 }}>
                {getMethodChip(selectedPayment.payment?.paymentMethod)}
              </Box>

              <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
              <Box sx={{ mb: 2 }}>
                {getStatusChip(selectedPayment.payment?.status)}
              </Box>

              <Typography variant="body2" color="text.secondary">Nội dung</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPayment.payment?.description || 'N/A'}
              </Typography>

              {selectedPayment.payment?.paidAt && (
                <>
                  <Typography variant="body2" color="text.secondary">Thời gian thanh toán</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(selectedPayment.payment?.paidAt)}
                  </Typography>
                </>
              )}

              {selectedPayment.transferInfo && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Thông tin chuyển khoản
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                    <Typography variant="body2"><strong>Ngân hàng:</strong> {selectedPayment.transferInfo.bankName}</Typography>
                    <Typography variant="body2"><strong>Số TK:</strong> {selectedPayment.transferInfo.accountNumber}</Typography>
                    <Typography variant="body2"><strong>Tên TK:</strong> {selectedPayment.transferInfo.accountName}</Typography>
                    <Typography variant="body2"><strong>Số tiền:</strong> {selectedPayment.transferInfo.formattedAmount}</Typography>
                    <Typography variant="body2"><strong>Nội dung:</strong> {selectedPayment.transferInfo.description}</Typography>
                  </Paper>
                </>
              )}

              {selectedPayment.payment?.status === 'pending' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Info /> Chờ xác nhận. Vui lòng kiểm tra tài khoản ACB và xác nhận thanh toán.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Đóng</Button>
          {selectedPayment?.payment?.status === 'pending' && (
            <>
              <Button color="error" onClick={() => {
                setDetailDialog(false);
                setCancelDialog(true);
              }}>
                Hủy
              </Button>
              <Button color="success" variant="contained" onClick={() => {
                setDetailDialog(false);
                setConfirmDialog(true);
              }}>
                Xác nhận thanh toán
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onClose={() => !confirming && setConfirmDialog(false)}>
        <DialogTitle>Xác nhận thanh toán VietQR</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Info /> Xác nhận khách hàng đã chuyển khoản thành công?
          </Alert>

          {selectedPayment && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              {/* Booking Info */}
              {selectedPayment.bookingInfo && (
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary">Thông tin khách hàng</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedPayment.bookingInfo.customerName}</Typography>
                  <Typography variant="body2">{selectedPayment.bookingInfo.customerPhone}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sản phẩm: {selectedPayment.bookingInfo.productName}
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" color="text.secondary">Mã thanh toán</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 1 }}>
                #{selectedPayment.id?.toString().slice(-8).toUpperCase() || selectedPayment._id?.toString().slice(-8).toUpperCase()}
              </Typography>

              <Typography variant="body2" color="text.secondary">Số tiền</Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold" sx={{ mb: 1 }}>
                {formatCurrency(selectedPayment.amount)}
              </Typography>

              {selectedPayment.bankInfo?.bankName && (
                <>
                  <Typography variant="body2" color="text.secondary">Ngân hàng</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {selectedPayment.bankInfo.bankName}
                  </Typography>
                </>
              )}

              {selectedPayment.transferContent && (
                <>
                  <Typography variant="body2" color="text.secondary">Nội dung CK</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: 'grey.200', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                    {selectedPayment.transferContent}
                  </Typography>
                </>
              )}
            </Paper>
          )}

          <TextField
            label="Ghi chú (tùy chọn)"
            multiline
            rows={2}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={confirming}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Sau khi xác nhận:
            <br />- Thanh toán sẽ được đánh dấu hoàn thành
            <br />- Đơn hàng sẽ được cập nhật sang trạng thái "Đã thanh toán"
            <br />- Thông báo Telegram sẽ được gửi cho admin
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={confirming}>Hủy</Button>
          <Button
            onClick={handleConfirmPayment}
            color="success"
            variant="contained"
            disabled={confirming}
            startIcon={confirming ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          >
            {confirming ? 'Đang xác nhận...' : 'Xác nhận thanh toán'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Hủy thanh toán</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy thanh toán này?
          </Alert>
          <TextField
            label="Lý do hủy"
            multiline
            rows={2}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Hủy</Button>
          <Button onClick={handleCancelPayment} color="error" variant="contained">
            Đồng ý hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPayments;
