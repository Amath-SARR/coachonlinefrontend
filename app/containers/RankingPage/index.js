/**
 *
 * RankingPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Blur4 from '../../images/images/Group 331.svg';
import Blur1 from '../../images/images/Group 4.svg';
import Blur2 from '../../images/images/Group 6.svg';
import Blur3 from '../../images/images/Group 8.svg';
import PageContainer from '../../components/PageContainer';
import {
  getCoachRankingsAction,
  getMonthBalanceAction,
  getMonthMinutesAction,
} from '../Statistics/actions';
import { getRealMonth, getYear, localizeDate } from '../../utils/localize';
import makeSelectStatistics from '../Statistics/selectors';
import StatisticsBoxes from '../../components/StatisticsBoxes/Loadable';
import messages from '../Subscription/messages';
import { colors } from '../../utils/colors';

const StatisticsWrapper = styled.div`
  padding: ${(props) => (props.withPannel ? '0 70px 0 130px' : '0 70px 0 70px')};
  margin: 30px 0;
  @media screen and (max-width: 1335px) {
    padding-left: 100px;
    padding-right: 40px;
  }
  @media screen and (max-width: 1024px) {
    padding-left: ${(props) => (props.withPannel ? '120px' : '60px')};
    padding-right: 60px;
  }
  @media screen and (max-width: 700px) {
    padding-left: ${(props) => (props.withPannel ? '50px' : '5px')};
    padding-right: 5px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => (props.borderBottom ? '1px' : 0)} solid #00000010;
  font-size: 18px;
  font-weight: ${(props) => props.weight || 'normal'};
  color: ${(props) => props.color || 'black'};
  padding: 20px 0;
  width: 100%;
  min-width: 400px;
`;
const ItemInColumn = styled.p`
  flex: ${(props) => props.flex || 1};
  text-align: ${(props) => props.textAlign || 'left'};
`;

export function RankingPage({
  history,
  statistics,
  getMonthBalances,
  getMonthMinutes,
  getCoachRanking,
}) {
  const month = getRealMonth();
  const year = getYear();

  useEffect(() => {
    getMonthBalances({ month, year });
    getMonthMinutes({ month, year });
    getCoachRanking({ month, year });
  }, []);

  const renderHeaders = () => (
    <Row weight="bold">
      <ItemInColumn flex={0.5}>
        <FormattedMessage {...messages.place} />
      </ItemInColumn>
      <ItemInColumn>
        <FormattedMessage {...messages.name} />
      </ItemInColumn>
      <ItemInColumn textAlign="center">
        {' '}
        <FormattedMessage {...messages.category} />
      </ItemInColumn>
      <ItemInColumn textAlign="right" flex={0.5}>
        {' '}
        <FormattedMessage {...messages.joined} />
      </ItemInColumn>
      <ItemInColumn textAlign="right" flex={0.5}>
        {' '}
        <FormattedMessage {...messages.totalMin} />
      </ItemInColumn>
    </Row>
  );

  const RankingItem = (props) => {
    const { item } = props;
    return (
      <Row borderBottom color={item.isMe ? colors.mainPink : 'black'}>
        <ItemInColumn flex={0.5}>{item.rankPosition}</ItemInColumn>
        <ItemInColumn>{item.name}</ItemInColumn>
        <ItemInColumn textAlign="center">{item.category}</ItemInColumn>
        <ItemInColumn textAlign="right" flex={0.5}>
          {localizeDate(item.joinDate)}
        </ItemInColumn>
        <ItemInColumn textAlign="right" flex={0.5}>
          {item.totalMinutes}
        </ItemInColumn>
      </Row>
    );
  };

  const renderList = () =>
    statistics?.ranking?.map((item) => <RankingItem key={item.id} item={item} />);

  return (
    <div>
      <Helmet>
        <title>RankingPage</title>
        <meta name="description" content="Description of RankingPage" />
      </Helmet>
      <PageContainer
        style={{
          childrenWrapper: {
            overflow: 'auto',
          },
        }}
        withPanel
        history={history}
        renderOutsideWindowContainer={
          <StatisticsWrapper withPannel>
            <StatisticsBoxes currentDate={{ currentMonth: month, currentYear: year }} />
          </StatisticsWrapper>
        }
      >
        {/*{renderHeaders()}*/}
        {/*{renderList()}*/}
      </PageContainer>
    </div>
  );
}

RankingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  statistics: makeSelectStatistics(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getMonthBalances: (data) => dispatch(getMonthBalanceAction(data)),
    getMonthMinutes: (data) => dispatch(getMonthMinutesAction(data)),
    getCoachRanking: (data) => dispatch(getCoachRankingsAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(RankingPage);
