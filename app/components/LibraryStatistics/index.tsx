/**
 *
 * LibraryStatistics
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FlexCenteredColumn, FlexRow, Text } from '../../global-styles';
import { Box } from '../../containers/Profile/LibraryProfilePage';
import DatePeriodSelector from '../DatePeriodSelector';
import { colors } from '../../utils/colors';
import { ages, professions } from './mocks';
import LibraryStatisticsSelector from './LibraryStatisticsSelector/Loadable';
import { LibraryStatisticsProps } from './index.props';
import {
  LibraryStatisticsByProfession,
  LibraryStatisticsByYearOfBirth,
} from '../../containers/Libraries/reducer.types';
import Image from '../Image';
//import makeSelectAuth from '../../containers/Auth/selectors';
import ChevronDownImg from '../../images/icons/chevron-down.svg';
import Modal from '../Modal';
import { subscriptionModalStyles } from '../../containers/Subscription';
import useWindowSize from '../../hooks/useWindowSize';
import LibraryConnectionsStatistics from './LibraryConnectionsStatistics/library-connections-statistics';
import { useParams } from 'react-router-dom';
import makeSelectLibraries from '../../containers/Libraries/selectors';
// import Label from '../Label';

const Wrapper = styled(FlexCenteredColumn)`
  width: 100%;
`;
const MainStatisticsWrapper = styled(FlexRow)`
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  max-width: 1020px;
  flex-wrap: wrap;
`;
export const DataRow = styled(FlexRow)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const Title = styled(Text)`
  font-size: 14px !important;
  font-weight: 600;
  padding: 10px 0;
`;
export const StringsWrapper = styled(FlexRow)`
  flex: 1.3;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Label = styled(Text)`
  font-size: 14px !important;
  min-width: 100px;
  font-weight: 400;
`;
export const Value = styled(Text)`
  text-align: center;
  padding: 0 5px;
  font-size: 21px !important;
  font-weight: 700;
  min-width: 53px;
`;
const BarWrapper = styled.div`
  flex: 1;
  height: 4px;
`;
const ChevronDown = styled(Image)`
  width: 20px;
  height: auto;
  cursor: pointer;
  filter: invert(1);
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
`;
interface BarProps {
  color: string;
  width: string;
  opacity: number;
}
const Bar = styled.div`
  height: 100%;
  background-color: ${({ color }: BarProps) => color || colors.mainGreen};
  width: ${({ width }: BarProps) => width || 0};
  opacity: ${({ opacity }: BarProps) => opacity || 1};
`;

function LibraryStatistics(props: LibraryStatisticsProps) {
  const { statistics, statisticsRange, onFetch, libraries } = props;
  const [professionsModalOpened, setProfessionsModalOpened] = useState(false);
  const { width } = useWindowSize();
  const { id } = useParams();
  const libraryId = id || libraries.profileData?.id;
  const onDateChange = ({ startDate, endDate }: { startDate: any; endDate: any }) =>
    onFetch(startDate, endDate);

  const visualizeData = (
    data: Array<{ label: string; value: number }>,
    options?: {
      barColor: string;
    },
  ) => {
    const { barColor } = options || {};
    const sum = data?.reduce(
      (acc, current) => {
        acc.total += current.value;
        return acc;
      },
      { total: 0 },
    );
    console.log('Sum', sum);
    return (
      data?.map((item) => {
        const widthPercent = (item.value * 100) / sum.total;
        return (
          <DataRow>
            <StringsWrapper>
              <Label>{item.label}</Label>
              <Value>{item.value}</Value>
            </StringsWrapper>
            <BarWrapper>
              <Bar color={barColor} width={`${widthPercent}%`} opacity={`${widthPercent * 2}%`} />
            </BarWrapper>
          </DataRow>
        );
      }) || null
    );
  };
  const modalStyle = subscriptionModalStyles(width);

  return (
    <Wrapper>
      <MainStatisticsWrapper>
        <Box>
          <Title>Nombre de lecteurs connectés</Title>
          <DataRow>
            <StringsWrapper>
              <Label>Depuis l'ouverture</Label>
              <Value>{statistics?.totalRegisteredUsers}</Value>
            </StringsWrapper>
          </DataRow>
          {/*<DataRow>*/}
          {/*  <StringsWrapper>*/}
          {/*    <Label>Au cours de la semaine en cours</Label>*/}
          {/*    <Value>450</Value>*/}
          {/*  </StringsWrapper>*/}
          {/*</DataRow>*/}
          <DataRow>
            <StringsWrapper>
              <DatePeriodSelector
                dark
                onChange={(dates: [any, any]) => {
                  const [startDate, endDate] = dates;
                  onDateChange({ startDate, endDate });
                }}
              />
              <Value>{statisticsRange?.totalRegisteredUsers}</Value>
            </StringsWrapper>
          </DataRow>
        </Box>
        <Box>
          <Title>Catégories sociales professionnelles</Title>
          {visualizeData(
            statisticsRange?.byProfession
              ?.map((item: LibraryStatisticsByProfession) => ({
                label: `${item.professionName}`,
                value: item.totalRegisteredUsers,
              }))
              ?.slice(0, 3) || [],
            { barColor: colors.mainPink },
          )}
          <ChevronDown src={ChevronDownImg} onClick={() => setProfessionsModalOpened(true)} />
        </Box>
        <Box>
          <Title>Connexion par tranche d'âge</Title>
          {visualizeData(
            statisticsRange?.byYearOfBirth?.map((item: LibraryStatisticsByYearOfBirth) => ({
              label: `${item.fromAge}-${item.toAge}`,
              value: item.totalRegisteredUsers,
            })) || [],
          )}
        </Box>
      </MainStatisticsWrapper>
      <LibraryStatisticsSelector />
      <LibraryConnectionsStatistics id={libraryId} />
      <Modal
        ariaHideApp={false}
        isOpened={professionsModalOpened}
        style={modalStyle}
        onClose={() => setProfessionsModalOpened(false)}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        {visualizeData(
          statisticsRange?.byProfession?.map((item: LibraryStatisticsByProfession) => ({
            label: `${item.professionName}`,
            value: item.totalRegisteredUsers,
          })),
          { barColor: colors.mainPink },
        )}
      </Modal>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  // auth: makeSelectAuth()
  libraries: makeSelectLibraries(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LibraryStatistics);
