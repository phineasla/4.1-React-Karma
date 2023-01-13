/* eslint-disable react/require-default-props */
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { FormEvent, useState } from 'react';

import {
  useCheckOutReminderMutation,
  useDismissReminderByIdMutation,
} from '../../../../redux/slices/reminderSlice';
import { useRequestOTPForTransferMutation } from '../../../../redux/slices/transferSlice';
import { Reminder } from '../../../../types';
import { formatDateTime, formatMoney } from '../../../../utils';

interface ReceivedColumn {
  id:
    | 'soTaiKhoan'
    | 'tenNguoiGui'
    | 'thoiGian'
    | 'soTien'
    | 'noiDung'
    | 'nutThanhToan'
    | 'nutHuy';
  label: string;
  minWidth?: number;
  align?: 'left';
  format?: (value: number) => string;
}

interface CreatedColumn {
  id:
    | 'soTaiKhoan'
    | 'tenNguoiNhan'
    | 'thoiGian'
    | 'soTien'
    | 'noiDung'
    | 'nutThanhToan'
    | 'nutHuy';
  label: string;
  minWidth?: number;
  align?: 'left';
  format?: (value: number) => string;
}

const receivedColumns: readonly ReceivedColumn[] = [
  { id: 'soTaiKhoan', label: 'Số tài khoản' },
  {
    id: 'tenNguoiGui',
    label: 'Người gửi',
    minWidth: 200,
  },
  { id: 'thoiGian', label: 'Thời gian', minWidth: 150 },
  {
    id: 'soTien',
    label: 'Số tiền',
    minWidth: 120,
  },
  {
    id: 'noiDung',
    label: 'Nội dung',
    minWidth: 400,
  },
  {
    id: 'nutThanhToan',
    label: '',
    minWidth: 60,
  },
  {
    id: 'nutHuy',
    label: '',
    minWidth: 60,
  },
];

const createdColumns: readonly CreatedColumn[] = [
  { id: 'soTaiKhoan', label: 'Số tài khoản' },
  {
    id: 'thoiGian',
    label: 'Thời gian',
    minWidth: 150,
  },
  {
    id: 'soTien',
    label: 'Số tiền',
    minWidth: 120,
  },
  {
    id: 'noiDung',
    label: 'Nội dung',
    minWidth: 200,
  },
  {
    id: 'nutHuy',
    label: '',
    minWidth: 60,
  },
];

interface DebtTableProps {
  created: boolean;
  completed?: boolean;
  data: Reminder[];
}

export default function DebtTable({
  created,
  completed = false,
  data,
}: DebtTableProps) {
  const [openDeleteDebtDialog, setOpenDeleteDebtDialog] = useState(false);
  const [openPayDebtDialog, setOpenPayDebtDialog] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(0);
  const soTK = localStorage.getItem('SOTK');

  const [requestOTPForTransfer, { isLoading: requestOTPLoading }] =
    useRequestOTPForTransferMutation();

  const handleOpenDeleteDebtDialog = (reminder: Reminder) => {
    setSelectedDebt(reminder.maNN);
    setOpenDeleteDebtDialog(true);
  };

  const handleCloseDeleteDebtDialog = () => {
    setOpenDeleteDebtDialog(false);
  };

  const handleOpenPayDebtDialog = async (reminder: Reminder) => {
    await requestOTPForTransfer({
      soTK,
      nguoiNhan: reminder.soTKNguoiGui,
      soTien: reminder.soTien,
    });

    setSelectedDebt(reminder.maNN);
    setOpenPayDebtDialog(true);
  };

  const handleClosePayDebtDialog = () => {
    setOpenPayDebtDialog(false);
  };

  const [dismissReminder, { isLoading: dismissReminderLoading }] =
    useDismissReminderByIdMutation();

  const handleDismissReminder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setOpenDeleteDebtDialog(false);

    try {
      await dismissReminder({
        id: selectedDebt,
        payload: {
          noiDungXoa: data.get('noiDung'),
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const [checkOutReminder, { isLoading: checkoutReminderLoading }] =
    useCheckOutReminderMutation();

  const handleCheckoutReminder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setOpenPayDebtDialog(false);

    try {
      await checkOutReminder({
        id: selectedDebt,
        payload: {
          otp: Number(data.get('otp')),
          noiDung: 'Giải quyết nhắc nợ',
          loaiCK: 'sender',
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell key="index">STT</TableCell>
              {created
                ? createdColumns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))
                : receivedColumns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.maNN} hover tabIndex={-1}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {created ? item.soTKNguoiNhan : item.soTKNguoiGui}
                </TableCell>
                <TableCell>{formatDateTime(new Date(item.ngayTao))}</TableCell>
                <TableCell>{formatMoney(item.soTien)} VND</TableCell>
                <TableCell>{item.noiDungNN}</TableCell>
                {!completed && (
                  <>
                    {!created && (
                      <TableCell sx={{ maxWidth: '5rem' }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleOpenPayDebtDialog(item)}
                        >
                          Thanh toán
                        </Button>
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenDeleteDebtDialog(item)}
                      >
                        Xoá
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDeleteDebtDialog} onClose={handleCloseDeleteDebtDialog}>
        <DialogTitle>Xoá nhắc nợ</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleDismissReminder}>
            <DialogContentText>
              Bạn có chắc muốn xoá nhắc nợ này?
            </DialogContentText>
            <TextField
              name="noiDung"
              required
              margin="dense"
              label="Nội dung"
              fullWidth
              multiline
              rows={4}
            />
            <DialogActions sx={{ paddingRight: 0 }}>
              <Button variant="outlined" onClick={handleCloseDeleteDebtDialog}>
                Hủy
              </Button>
              <Button variant="contained" type="submit">
                Xoá
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openPayDebtDialog} onClose={handleClosePayDebtDialog}>
        <DialogTitle>Thanh toán nhắc nợ</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCheckoutReminder}>
            <DialogContentText>
              Bạn có chắc muốn thanh toán nhắc nợ này?
            </DialogContentText>
            <TextField
              name="otp"
              required
              margin="dense"
              label="Mã OTP"
              fullWidth
            />
            <Typography variant="caption">
              Vui lòng nhập mã OTP đã được gửi đến email của bạn
            </Typography>
            <DialogActions sx={{ paddingRight: 0 }}>
              <Button variant="outlined" onClick={handleClosePayDebtDialog}>
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                Thanh toán
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          dismissReminderLoading || requestOTPLoading || checkoutReminderLoading
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
