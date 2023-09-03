/**
 *
 * Table
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import messages from '../messages';
import Button from '../Button';
import Image from '../Image';
import { BASE_URL } from '../../config/env';
import CourseStatus from '../CourseStatus';

const StyledTable = styled.table`
  width: 100%;
  tr {
    th {
      text-align: center;
      font-size: 16px;
      color: #707070;
      padding-bottom: 10px;
      flex: 1;
    }
    td {
      text-align: center;
    }
  }
  tbody {
    tr {
      border-bottom: 1px solid #efefef;
    }
    td {
      padding: 8px 0;
      min-width: 150px;
      flex: 1;
    }
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;
const NoItemsInfo = styled.p`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 40px;
  text-align: center;
`;
function Table({
  data,
  headers = [],
  itemData = [],
  emptyListComponent,
  ItemComponent,
  onItemClick = (item) => null,
}) {
  const renderHeaders = () =>
    headers?.map((header) => <th style={header.style}>{header.label}</th>);

  const renderItems = () =>
    data?.map((item) => (
      <tr
        key={item.id}
        id={item.id}
        onClick={() => onItemClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <ItemComponent item={item} />
      </tr>
    ));

  return (
    <TableWrapper>
      {!data?.length && <NoItemsInfo>{emptyListComponent}</NoItemsInfo>}
      <StyledTable>
        {data.length > 0 && (
          <thead>
            <tr>{renderHeaders()}</tr>
          </thead>
        )}
        {data.length > 0 && <tbody>{renderItems()}</tbody>}
      </StyledTable>
    </TableWrapper>
  );
}

export default Table;
