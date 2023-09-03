/**
 *
 * SortableTable
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import SortableTableProps, { SortableTableHeader } from './sortable-table.props';
import ArrowUp from '../../images/icons/arrow-up-triangle.png';
import useAsyncState from '../../hooks/useAsyncState';

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
      //border-bottom: 1px solid #efefef;
    }
    td {
      padding: 8px 0;
      min-width: 150px;
      flex: 1;
    }
  }
`;

const ArrowIcon = styled.img`
  width: 15px;
  height: 15px;
  opacity: 0.6;
  margin-left: 5px;
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

function SortableTable(props: SortableTableProps) {
  const {
    data,
    headers = [],
    emptyListComponent,
    ItemComponent = <div></div>,
    onItemClick = () => null,
    sort = () => null,
  } = props;

  const [sortingKey, setSortingKey] = useState('');
  const [sortingIncreasingly, setSortingIncreasingly] = useAsyncState(false);

  const onSort = (key: string) => {
    setSortingKey(key);
    setSortingIncreasingly(!sortingIncreasingly).then(() => sort(key, sortingIncreasingly));
  };

  const renderHeaders = () =>
    headers?.map((header: SortableTableHeader) => (
      <th
        key={header.key}
        style={{ ...header.style, cursor: header.canSort ? 'pointer' : 'not-allowed' }}
        onClick={() => header.canSort && onSort(header.key)}
      >
        {header.label}
        {sortingKey === header.key && (
          <ArrowIcon
            src={ArrowUp}
            style={{
              transform: sortingIncreasingly ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          />
        )}
      </th>
    ));

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

export default SortableTable;
