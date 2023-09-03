/**
 *
 * AffiliationRankings
 *
 */

import React, { useEffect, useState } from 'react';
import AffiliationRankingsProps from './affiliation-rankings.props';
import styled from 'styled-components';
import { DispatchType } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import makeSelectAffiliation from '../../containers/Affiliation/selectors';
import { colors } from '../../utils/colors';
import Tabs from '../Tabs';
import { localizeCurrency, localizeDate } from '../../utils/localize';
import { getRankingsAction } from '../../containers/Affiliation/actions';
import { RankingTypes } from '../../containers/Affiliation/reducer.types';
import { fullName } from '../../utils/formatters';
import messages from '../../containers/Subscription/messages';
import { FormattedMessage } from 'react-intl';

const Wrapper = styled.div``;
const TabBody = styled.div`
  padding: 20px;
  min-width: 100%;
  max-width: 1000px;
  @media screen and (max-width: 460px) {
    max-width: 250px;
    overflow: scroll;
  }
  ${(props) => props.style};
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
  padding: 0 5px;
`;

const TABS = [
  {
    label: 'Classement revenus des coachs',
    id: 'coaches',
  },
  {
    label: 'Classement revenus de etudiants',
    id: 'students',
  },
  { label: 'Classement revenus de tous', id: 'all' },
];

const Headers = (props) => {
  const { dark } = props;
  return (
    <Row color={dark ? colors.white : colors.black} weight="bold">
      <ItemInColumn flex={0.5}>
        <FormattedMessage {...messages.place} />
      </ItemInColumn>
      <ItemInColumn>
        <FormattedMessage {...messages.name} />
      </ItemInColumn>
      <ItemInColumn textAlign="center">Nombre d'affiliés</ItemInColumn>
      {/*<ItemInColumn textAlign="center">Revenus</ItemInColumn>*/}
      <ItemInColumn textAlign="right">
        <FormattedMessage {...messages.joined} />
      </ItemInColumn>
    </Row>
  );
};

const RankingItem = (props) => {
  const { item, dark, accent = colors.mainGreen, type } = props;
  const color = item?.isCurrentUser ? accent : dark ? colors.white : colors.black;
  if (!item) {
    return null;
  }
  return (
    <Row borderBottom color={color}>
      <ItemInColumn flex={0.5}>{item.rankId}</ItemInColumn>
      <ItemInColumn>{fullName(item)}</ItemInColumn>
      {type === RankingTypes.coaches && (
        <>
          <ItemInColumn textAlign="center">{item.affiliateCoachesTotal}</ItemInColumn>
          {/*<ItemInColumn textAlign="center">*/}
          {/*  {localizeCurrency(item.totalCoachesEarnings, item.currency)}*/}
          {/*</ItemInColumn>*/}
        </>
      )}
      {type === RankingTypes.students && (
        <>
          <ItemInColumn textAlign="center">{item.affiliateSubscribersTotal}</ItemInColumn>
          {/*<ItemInColumn textAlign="center">*/}
          {/*  {localizeCurrency(item.totalSubscribersEarnings, item.currency)}*/}
          {/*</ItemInColumn>*/}
        </>
      )}
      {type === RankingTypes.all && (
        <>
          <ItemInColumn textAlign="center">{item.affiliateUsersTotal}</ItemInColumn>
          {/*<ItemInColumn textAlign="center">*/}
          {/*  {localizeCurrency(item.totalEarnings, item.currency)}*/}
          {/*</ItemInColumn>*/}
        </>
      )}
      <ItemInColumn textAlign="right">{localizeDate(item.joinDate)}</ItemInColumn>
    </Row>
  );
};

function AffiliationRankings(props: AffiliationRankingsProps) {
  const { affiliation, getRankings, dark, accent } = props;
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchRankings({
      type: RankingTypes.all,
      topOnly: true,
      actions: {
        onFetchEnd: () =>
          fetchRankings({
            type: RankingTypes.coaches,
            topOnly: true,
            actions: {
              onFetchEnd: () => fetchRankings({ type: RankingTypes.students, topOnly: true }),
            },
          }),
      },
    });
  }, []);

  const fetchRankings = ({ type, topOnly, actions = {} }) => {
    getRankings({ body: { type, topOnly }, actions });
  };

  const onTabChange = (index, tab) => {
    setActiveTab(index);
  };

  const Ranking = (props) => {
    const { type, dark, accent } = props;
    return (
      affiliation.rankings[type]?.map((user) => (
        <RankingItem dark={dark} type={type} item={user} accent={accent} />
      )) || null
    );
  };

  return (
    <Wrapper>
      <Tabs
        styles={
          dark
            ? {
              tabStyle: {
                borderBottom: 'none',
              },
              activeTabStyle: {
                borderBottom: `1px solid ${colors.mainGreen}`,
                padding: '5px',
              },
            }
            : {
              tabStyle: {
                borderBottom: 'none',
              },
              activeTabStyle: {
                borderBottom: `1px solid ${colors.mainPink}`,
              },
              tabTextStyle: {
                color: 'black',
              },
            }
        }
        hideNextButton
        useColorOverlays={false}
        onTabChange={onTabChange}
        activeIndex={activeTab}
        tabs={TABS}
      >
        <TabBody>
          <Headers dark={dark} accent={accent} />
          <Ranking dark={dark} type={RankingTypes.coaches} accent={accent} />
        </TabBody>
        <TabBody>
          <Headers dark={dark} accent={accent} />
          <Ranking dark={dark} type={RankingTypes.students} accent={accent} />
        </TabBody>
        <TabBody>
          <Headers dark={dark} accent={accent} />
          <Ranking dark={dark} type={RankingTypes.all} accent={accent} />
        </TabBody>
      </Tabs>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getRankings: (data) => dispatch(getRankingsAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  affiliation: makeSelectAffiliation(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AffiliationRankings);
