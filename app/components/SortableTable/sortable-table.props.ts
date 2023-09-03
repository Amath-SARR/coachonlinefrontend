import React from 'react';

export interface SortableTableHeader {
  key: string;
  label: string;
  canSort: boolean;
  style: React.CSSProperties;
}
export default interface SortableTableProps {
  data: any[];
  headers: SortableTableHeader[];
  emptyListComponent: React.ReactElement | string;
  ItemComponent: React.ReactElement;
  onItemClick: (item: any[]) => void;
  sort: (key: string, sortingIncreasingly: boolean) => void;
}
