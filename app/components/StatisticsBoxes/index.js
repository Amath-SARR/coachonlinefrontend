/**
 *
 * StatisticsBoxes
 *
 */

import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import messages from '../messages';
import billingMessages from '../../containers/BillingPage/messages';
import { colors } from '../../utils/colors';
import makeSelectStatistics from '../../containers/Statistics/selectors';
import {
  getMonthBalanceAction,
  getMonthMinutesAction,
  getMonthStatisticsAction,
} from '../../containers/Statistics/actions';
import Image from '../Image';
import { localizeCurrency } from '../../utils/localize';
import { balanceWithdrawAction } from '../../containers/Auth/actions';
const backgroundBubbles = require('../../images/images/statistics-background.png');
// import makeSelectAffiliation from '../../containers/Affiliation/selectors';
// import getEarningsAction from '../../containers/Affiliation/actions';

const DataBoxesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 45px 0;
  @media screen and (max-width: 1050px) {
    flex-direction: column;
  }
`;
export const DataBox = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: center;
  text-align: left;
  max-width: 48%;
  margin: 0 20px;
  height: 200px;
  border-radius: 13px;
  background-color: ${(props) => props.backgroundColor || colors.secondaryPink};
  padding: 30px 50px;
  z-index: 0;
  @media screen and (max-width: 1050px) {
    //width: 100%;
    max-width: unset;
    margin-bottom: 20px;
    padding: 15px 25px;
  }
`;
export const DataText = styled.p`
  color: ${colors.white};
  width: 100%;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
  z-index: 1;
  @media screen and (max-width: 1050px) {
    font-size: 18px;
  }
`;
const LinkedText = styled(DataText)`
  cursor: pointer;
`;
const BackgroundImage = styled(Image)`
  position: absolute;
  width: 100%;
  height: auto;
`;

function StatisticsBoxes({
  history,
  statistics,
  currentDate,
  getMonthBalances,
  getMonthMinutes,
  makePayout,
  // affiliation,
  // getEarnings,
}) {
  useEffect(() => {
    getMonthBalances({
      month: currentDate.currentMonth,
      year: currentDate.currentYear,
    });
    getMonthMinutes({
      month: currentDate.currentMonth,
      year: currentDate.currentYear,
    });
  }, [currentDate.currentMonth]);

  const calcPercentageDiff = (a, b) => {
    const aFromBPercentage = b <= 0 ? 200 : (a * 100) / b;
    return Math.round(aFromBPercentage - 100);
  };

  const renderPercentageDiff = (currentMonth, prevMonth) => {
    const percentageDiff = calcPercentageDiff(currentMonth, prevMonth);
    const key = percentageDiff > 0 ? 'Augmenté de' : 'Diminué de';
    return (
      <DataText>
        {currentMonth ? `${key}: ${Math.abs(percentageDiff)}%` : 'Aucunes données pour l’instant'}
      </DataText>
    );
  };

 

  return (
    <DataBoxesWrapper>
      <DataBox>
        <BackgroundImage src={backgroundBubbles} />
        {!!statistics?.monthBalance?.currency && (
          <DataText>
            <FormattedMessage {...messages.totalEarningsThisMonth} />:{' '}
            {localizeCurrency(
              statistics?.monthBalance?.totalBalanceCurrentMonth,
              statistics?.monthBalance?.currency,
            )}
            {/* <DataText>{localizeCurrency(affiliation?.totalEarnings?.total)}</DataText> */}
          </DataText>
        )}
        {renderPercentageDiff(
          statistics?.monthBalance?.totalBalanceCurrentMonth,
          statistics?.monthBalance?.totalBalancePreviousMonth,
        )}
      </DataBox>
      <DataBox backgroundColor={`${colors.secondaryPink}99`}>
        <BackgroundImage src={backgroundBubbles} />
        {!!statistics?.monthMinutes?.month && (
          <DataText>
            <FormattedMessage {...messages.totalMinutesThisMonth} />:{' '}
            {statistics?.monthMinutes?.totalWatchedMinutesCurrentMonth}min
          </DataText>
        )}
        {renderPercentageDiff(
          statistics?.monthMinutes?.totalWatchedMinutesCurrentMonth,
          statistics?.monthMinutes?.totalWatchedMinutesPreviousMonth,
        )}
      </DataBox>
      <DataBox>
        <BackgroundImage src={backgroundBubbles} />

        <DataText>
          {statistics?.monthBalance?.currency ? (
            <>
              <FormattedMessage {...messages.currentBalance} />:{' '}
              {localizeCurrency(
                statistics?.monthBalance?.totalBalanceToWithdrawCurrentMonth,
                statistics?.monthBalance?.currency,
              )}
            </>
          ) : (
            'Aucunes données pour l’instant'
          )}
        </DataText>
        {!!statistics?.monthBalance?.currency && (
          <LinkedText onClick={makePayout}>
            <FormattedMessage {...billingMessages.payout} /> ->
          </LinkedText>
        )}
      </DataBox>
    </DataBoxesWrapper>
  );
}

StatisticsBoxes.propTypes = {};

const mapStateToProps = createStructuredSelector({
  statistics: makeSelectStatistics(),
  // affiliation: makeSelectAffiliation(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMonthStatistics: (data) => dispatch(getMonthStatisticsAction(data)),
    getMonthBalances: (data) => dispatch(getMonthBalanceAction(data)),
    getMonthMinutes: (data) => dispatch(getMonthMinutesAction(data)),
    makePayout: () => dispatch(balanceWithdrawAction()),
    // getEarnings: (data) => dispatch(getEarningsAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(StatisticsBoxes);
