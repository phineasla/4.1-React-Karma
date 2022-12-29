import React from 'react';
import { useMediaQuery } from '@mui/material';
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  EditButton,
  TextInput,
  DeleteWithConfirmButton,
  FunctionField,
} from 'react-admin';

import { formatPhoneNumber } from '../../utils/helpers';

const bankerFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  // <ReferenceInput source="userId" label="User" reference="users" />,
];

export function StatisticList() {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  return (
    <List filters={bankerFilters}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.soTienGui}
          secondaryText={(record) => record.soTienNhan}
        />
      ) : (
        <Datagrid>
          <TextField source="id" label="ID" sortable={false} />
          <TextField source="soTienGui" label="Sent" sortable={false} />
          <TextField source="soTienNhan" label="Received" sortable={false} />

          <EditButton />
          <DeleteWithConfirmButton />
        </Datagrid>
      )}
    </List>
  );
}
