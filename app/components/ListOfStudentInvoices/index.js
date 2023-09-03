/**
 *
 * ListOfStudentInvoices
 *
 */

import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import Loader from 'react-loader-spinner';
import { colors } from '../../utils/colors';
import subscriptionMessages from '../../containers/Subscription/messages';
import { localizeCurrency, localizeDate } from '../../utils/localize';
import PageContainer from '../PageContainer';
import Button from '../Button';
import makeSelectSubscription from '../../containers/Subscription/selectors';
import { getInvoicesAction } from '../../containers/Subscription/actions';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  @media screen and (max-width: 600px) {
    padding: 0;
  }
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) => !props.isHeader && colors.backgroundBlue};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: 500px;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const TableItem = styled.div`
  min-width: 50px;
  width: calc(100% / 6);
  font-size: 12px;
  font-weight: ${(props) => (props.isHeader ? 600 : 300)};
  color: ${colors.lilac};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 0;
`;
const StyledLink = styled.a``;
const HEADERS = [
  subscriptionMessages.tableDate,
  subscriptionMessages.tableDescription,
  subscriptionMessages.tableServicePeriod,
  subscriptionMessages.tableCreditCard,
  subscriptionMessages.tableSubtotal,
  subscriptionMessages.tableTotal,
];
export function ListOfStudentInvoices({ subscription, getInvoices }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getInvoices({ finally: () => setLoading(false) });
  }, []);

  const renderTableHeaders = () => (
    <TableRow isHeader>
      {HEADERS.map((header, index) => (
        <TableItem textAlign="center" isDark isHeader key={index}>
          <FormattedMessage {...header} />
        </TableItem>
      ))}
    </TableRow>
  );

  const renderTableInvoices = () =>
    subscription?.invoices?.map((invoice) => {
      const invoiceDate = localizeDate(invoice.invoiceDate);
      const periodStartDate = localizeDate(invoice.periodStart);
      const periodEndDate = localizeDate(invoice.periodEnd);
      const subtotal = localizeCurrency(invoice.subtotal, invoice.currency);
      const total = localizeCurrency(invoice.total, invoice.currency);

      return (
        <TableRow
          key={invoice.invoiceStripeId}
          as={StyledLink}
          href={invoice.invoicePdf}
          target="_blank"
        >
          <TableItem isDark>{invoiceDate}</TableItem>
          <TableItem isDark>{invoice.description}</TableItem>
          <TableItem isDark>
            {periodStartDate}-{periodEndDate}
          </TableItem>
          <TableItem isDark>**** **** **** {invoice.cardLast4Digits}</TableItem>
          <TableItem isDark>{subtotal}</TableItem>
          <TableItem isDark>{total}</TableItem>
        </TableRow>
      );
    });

  return (
    <Wrapper>
      {loading && (
        <LoaderWrapper visible={loading}>
          <Loader type="Oval" color="grey" height={30} width={30} />
        </LoaderWrapper>
      )}
      {renderTableHeaders()}
      {renderTableInvoices()}
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInvoices: (data) => dispatch(getInvoicesAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ListOfStudentInvoices);
