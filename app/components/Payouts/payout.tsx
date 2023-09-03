import { localizeCurrency, localizeDate } from '../../utils/localize';
import {
  IPayoutRequest,
  PayoutStatusEnum,
  PayoutTypesEnum,
} from '../../containers/Affiliation/reducer.types';
import Image from '../Image';
import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';

const Wrapper = styled.div``;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) =>
    !props.isHeader && (props.isChild ? colors.inputBlue : colors.backgroundBlue)};
  color: ${(props) => props.color || colors.white};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: fit-content;
  width: 100%;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const TableItem = styled.div`
  min-width: 100px;
  width: calc(100% / 6);
  font-size: 12px;
  font-weight: ${(props) => (props.isHeader ? 600 : 300)};
  // color: ${(props) => props.color || colors.white};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 5px;
`;

const Payout: FC<{ payout: IPayoutRequest; isChild?: boolean; index: number }> = ({
  payout,
  isChild = false,
  index,
}) => {
  const requestDate = localizeDate(payout.requestDate);

  const statusColor = (status: PayoutStatusEnum) => {
    switch (status) {
      case PayoutStatusEnum.Withdrawn:
        return colors.mainGreen;
      case PayoutStatusEnum.Rejected:
        return '#ff9e9e';
      case PayoutStatusEnum.Requested:
      default:
        return `${colors.white}90`;
    }
  };

  const payoutType = (type: PayoutTypesEnum) => {
    switch (type) {
      case PayoutTypesEnum.Affiliation:
        return "Revenus d'affiliation";
      case PayoutTypesEnum.CoachPayout:
      default:
        return 'Revenus des cours';
    }
  };

  return (
    <Wrapper>
      <TableRow color={statusColor(payout.status)} key={payout.id}>
        <TableItem isDark>{index + 1}</TableItem>
        <TableItem isDark>{requestDate}</TableItem>
        <TableItem isDark>{payoutType(payout.paymentType)}</TableItem>
        <TableItem isDark>{payout.payoutTypeStr}</TableItem>
        <TableItem isDark>{localizeCurrency(payout.value)}</TableItem>
        <TableItem isDark>{payout.statusStr}</TableItem>
        <TableItem isDark>{payout.rejectReason}</TableItem>
      </TableRow>
    </Wrapper>
  );
};

export default Payout;
