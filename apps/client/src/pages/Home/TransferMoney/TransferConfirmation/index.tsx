import { Box, Button, Card, Typography } from '@mui/material';
import React, { FormEvent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { formatMoney } from '../../../../utils';

import { StyledRow, StyledTitle } from './styles';

interface TransferConfirmationProps {
  activeStep: number;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function TransferConfirmation({
  activeStep,
  handleSubmit,
}: TransferConfirmationProps) {
  const { soTK, soTien, noiDungCK, hinhThucThanhToan } = useSelector(
    (state: RootState) => state.transfer.transferInfo
  );

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit}>
        <Card sx={{ padding: '1rem' }}>
          <StyledRow>
            <StyledTitle>Đến</StyledTitle>
            <Typography sx={{ width: '100%' }}>{soTK}</Typography>
          </StyledRow>
          <StyledRow>
            <StyledTitle>Số tiền</StyledTitle>
            <Typography sx={{ width: '100%' }}>
              {formatMoney(soTien)} VND
            </Typography>
          </StyledRow>
          <StyledRow>
            <StyledTitle>Mô tả</StyledTitle>
            <Typography sx={{ width: '100%' }}>{noiDungCK}</Typography>
          </StyledRow>
          <StyledRow>
            <StyledTitle>Hình thức thanh toán</StyledTitle>
            <Typography sx={{ width: '100%' }}>
              {hinhThucThanhToan === 'sender'
                ? 'Người gửi trả'
                : 'Người nhận trả'}
            </Typography>
          </StyledRow>
        </Card>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={() => {
              console.log('TODO Back');
            }}
            sx={{ mr: 1 }}
          >
            Quay lại
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button type="submit">Tiếp tục</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default TransferConfirmation;
