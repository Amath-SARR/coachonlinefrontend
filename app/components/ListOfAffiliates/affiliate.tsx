import { localizeCurrency, localizeDate } from '../../utils/localize';
import { SubscriptionTypes } from '../../containers/Affiliation/reducer.types';
import Image from '../Image';
import ReactTooltip from 'react-tooltip';
import { fullName } from '../../utils/formatters';
import ChevronDownImg from '../../images/icons/chevron-down--white.png';
import WarningImg from '../../images/icons/warning.svg';
import React, { useState } from 'react';
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
const Chevron = styled(Image)`
  width: 15px;
  height: 15px;
  margin-left: 10px;
  transition: all 0.5s ease-in-out;
  opacity: ${(props: { disabled: boolean }) => (props.disabled ? 0.4 : 1)} !important;
  cursor: ${(props: { disabled: boolean }) => (props.disabled ? 'not-allowed' : 'pointer')};
`;
const CommissionWrapper = styled.label`
  display: flex;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 5px;
  padding-left: 10px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'unset')};
  .commission-tooltip {
    width: 300px;
  }
`;
const InfoIconWrapper = styled.div`
  margin-left: 5px;
  width: 15px;
  height: 15px;
  filter: invert(0.5);
`;
const ChildrenAffiliatesWrapper = styled.div`
  padding-left: 20px;
  overflow: hidden;
  height: ${(props: { opened: boolean }) => (props.opened ? 'fit-content' : 0)};
  transition: all 0.5s ease-in-out;
`;

const Affiliate = (props) => {
  const { user, isChild = false, index } = props;
  const [childrenAffiliatesOpened, setChildrenAffiliatesOpened] = useState(false);

  const joinDate = localizeDate(user.joinDate);

  const toggleChildrenAffiliates = () => setChildrenAffiliatesOpened(!childrenAffiliatesOpened);

  const CommissionInfo = (props) => {
    const { user } = props;
    return (
      <CommissionWrapper>
        <span style={{ width: '40px' }}>{user.tooltipData?.value}</span>
      </CommissionWrapper>
    );
  };

  const Earnings = (props) => {
    const { user, value } = props;
    const earnings = localizeCurrency(value, user.currency);
    return (
      <CommissionWrapper>
        <span style={{ lineHeight: '22px' }}>{earnings}</span>
        <InfoIconWrapper data-for="commission-tooltip" data-tip={user.tooltipData?.tooltip}>
          <Image src={WarningImg} />
        </InfoIconWrapper>
        <ReactTooltip
          id="commission-tooltip"
          place="left"
          multiline
          className="commission-tooltip"
        />
      </CommissionWrapper>
    );
  };

  return (
    <Wrapper>
      <TableRow color={user.chosenPlan ? `#c8d38f` : '#ff9e9e'} isChild={isChild} key={user.userId}>
        <TableItem isDark>{index + 1}</TableItem>
        <TableItem isDark>{joinDate}</TableItem>
        <TableItem isDark>{fullName(user).trim() || 'Pas de données'}</TableItem>
        <TableItem isDark style={{ minWidth: 130 }}>
          {user.email}
        </TableItem>
        <TableItem isDark>{user.userRole}</TableItem>
        <TableItem isDark>{user.chosenPlan || 'Aucun abonnement sélectionné'}</TableItem>
        <TableItem isDark>{user.subCancellationReason}</TableItem>
        <TableItem isDark>
          <Earnings user={user} value={user.potentialYearlyIncome} />
        </TableItem>
        <TableItem isDark>
          <Earnings user={user} value={user.earnedMoney} />
        </TableItem>
        <TableItem isDark>
          {user.potentialNextPaymentDate
            ? localizeDate(user.potentialNextPaymentDate)
            : 'Aucun abonnement sélectionné'}
        </TableItem>
        <TableItem isDark>
          <CommissionInfo user={user} />
        </TableItem>
        <TableItem isDark>
          {!!user.affiliates?.length && (
            <Chevron
              onClick={user.affiliates?.length ? toggleChildrenAffiliates : () => null}
              disabled={!user.affiliates?.length}
              style={{
                transform: childrenAffiliatesOpened ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              src={ChevronDownImg}
            />
          )}
        </TableItem>
      </TableRow>
      <ChildrenAffiliatesWrapper opened={childrenAffiliatesOpened}>
        {user.affiliates?.map((affiliate, index) => (
          <Affiliate user={affiliate} isChild index={index} />
        ))}
      </ChildrenAffiliatesWrapper>
    </Wrapper>
  );
};

export default Affiliate;
