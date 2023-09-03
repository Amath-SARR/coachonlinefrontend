/**
 *
 * ListOfAffiliates
 *
 */

import React, { FC, useState } from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { fullName } from '../../utils/formatters';
import Payout from './payout';
import Input from '../Input';
import { localizeCurrency } from '../../utils/localize';
import { IPayoutRequest } from '../../containers/Affiliation/reducer.types';
import { Text } from '../../global-styles';

interface TableProps {
  isHeader?: boolean;
  textAlign?: string;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
  @media screen and (max-width: 600px) {
    padding: 0;
    //max-width: 250px;
    //overflow: scroll;
  }
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const TableRow = styled.div<TableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) => !props.isHeader && colors.backgroundBlue};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: fit-content;
  width: 100%;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const TableItem = styled.div<TableProps>`
  min-width: 50px;
  width: calc(100% / 6);
  font-size: 12px;
  font-weight: ${(props) => (props.isHeader ? 600 : 300)};
  color: ${colors.white};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 5px;
`;

const Sum = styled.span`
  color: ${(props) => props.color || colors.white};
  padding: 0 5px;
`;

const HEADERS = [
  {
    label: '',
  },
  {
    label: 'Date',
  },
  {
    label: 'Paiement de',
  },
  {
    label: 'Prestataire de paiement',
  },
  {
    label: 'Montant',
  },
  {
    label: 'Statut',
  },
  {
    label: 'Raison',
  },
];

const PayoutsList: FC<{ data: IPayoutRequest[]; options?: { dark?: boolean } }> = ({
  data,
  options,
}): React.ReactElement | null =>
  data?.map((payout, index) => (
    <Payout key={payout.id} dark={options?.dark} payout={payout} index={index} />
  )) || null;

function Payouts({ payouts: data, loading, dark, onGenerateAffiliatesFile }) {
  const [payouts, setPayouts] = useState(data);

  return (
    <Wrapper>
      {loading && (
        <LoaderWrapper visible={loading}>
          <Loader type="Oval" color="grey" height={30} width={30} />
        </LoaderWrapper>
      )}
      <TableRow isHeader>
        {HEADERS.map((header, index) => (
          <TableItem textAlign="center" isDark isHeader key={index}>
            {header.label}
          </TableItem>
        ))}
      </TableRow>
      {payouts?.length > 0 ? (
        <PayoutsList data={payouts} options={{ dark }} />
      ) : (
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 600 }}>
          Vous n'avez pas encore demandé de retrait
        </Text>
      )}
    </Wrapper>
  );
}

export default Payouts;
