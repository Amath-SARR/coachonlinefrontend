/**
 *
 * LibraryStatisticsSelector
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { LongBox } from '../../../containers/Profile/LibraryProfilePage';
import { DataRow, Label, StringsWrapper, Value } from '../index';
import { colors } from '../../../utils/colors';
import DatePeriodSelector from '../../DatePeriodSelector';
import StatisticsImg from '../../../images/icons/statistics--green.svg';
import Button from '../../Button';
import useWindowSize from '../../../hooks/useWindowSize';
import Modal from '../../../components/Modal';
import { LineChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ages, agesChart, proffessionsList } from '../mocks';
import { FlexRow } from '../../../global-styles';
import SelectInput from '../../SelectInput';
import CheckBox from '../../CheckBox';
import {
  getLibraryStatisticsChartAction,
  getProfessionsAction,
} from '../../../containers/Libraries/actions';
import { GetLibraryStatisticsActionData } from '../../../containers/Libraries/actions.types';
import { useParams } from 'react-router-dom';
import makeSelectAuth from '../../../containers/Auth/selectors';
import makeSelectLibraries from '../../../containers/Libraries/selectors';
import { Controller } from 'react-hook-form';
import messages from '../../messages';

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 20px;
`;

const ParamsWrapper = styled(FlexRow)`
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin-bottom: 15px;
`;

const StyledButton = styled(Button)`
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  max-width: 300px;
  padding: 10px 20px;
  margin-bottom: 20px;
`;
const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 4px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;
const ShortDataRow = styled(DataRow)`
  max-width: 350px;
`;

const modalStyle = (width: number) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}E6`,
  },
  modalBody: {
    maxHeight: '90vh',
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #1B2134 0%, #121621 100%)',
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    width: '100%',
    maxWidth: '1460px',
    height: '100%',
    maxHeight: '700px',
  },
});

function LibraryStatisticsSelector(props) {
  const defaultProfession = { label: 'Agriculteurs exploitants', value: 1 };
  const { auth, libraries, getStatisticsChart, getProfessions } = props;
  const { width } = useWindowSize();
  const { id } = useParams();
  const [modalOpened, setModalOpened] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [filters, setFilters] = useState({
    female: true,
    male: true,
    profession: 1,
  });

  useEffect(() => {
    getProfessions();
    fetchStatistics();
  }, []);

  const fetchStatistics = () => {
    getStatisticsChart({
      body: { id: id || libraries.profileData?.id, token: auth.authToken },
      actions: {
        onSuccess: (data) => onProfessionChange(defaultProfession, data?.registered),
      },
    });
  };

  const onDateChange = ({ startDate, endDate }: { startDate: any; endDate: any }) => null;

  const onProfessionChange = (option, list) => {
    setFilters({ ...filters, profession: option.value });
    const data =
      (list || libraries.statisticsChart?.registered)?.filter((item) => item.id === option.value) ||
      [];
    setCurrentData(data[0]);
  };

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);
  return (
    <LongBox>
      <ParamsWrapper>
        <SelectInput
          wrapperStyle={{ width: 170, margin: 0 }}
          options={libraries.professions?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          defaultValue2={defaultProfession}
          onChange={onProfessionChange}
          redesigned
        />
        <CheckBox
          label={'Femme'}
          onChange={(val) => setFilters({ ...filters, female: val })}
          checked={filters.female}
        />
        <CheckBox
          label={'Homme'}
          onChange={(val) => setFilters({ ...filters, male: val })}
          checked={filters.male}
        />
      </ParamsWrapper>
      <ShortDataRow>
        <StringsWrapper>
          <Label>Depuis l'ouverture</Label>
          <Value>{libraries.statistics?.totalRegisteredUsers}</Value>
        </StringsWrapper>
      </ShortDataRow>
      {/*<ShortDataRow>*/}
      {/*  <StringsWrapper>*/}
      {/*    <Label>Au cours de la semaine en cours</Label>*/}
      {/*    <Value>450</Value>*/}
      {/*  </StringsWrapper>*/}
      {/*</ShortDataRow>*/}
      {/*<ShortDataRow>*/}
      {/*  <StringsWrapper>*/}
      {/*    <DatePeriodSelector*/}
      {/*      dark*/}
      {/*      onChange={(dates: [any, any]) => {*/}
      {/*        const [startDate, endDate] = dates;*/}
      {/*        onDateChange({ startDate, endDate });*/}
      {/*      }}*/}
      {/*    />*/}
      {/*    <Value>750</Value>*/}
      {/*  </StringsWrapper>*/}
      {/*</ShortDataRow>*/}
      <StyledButton
        color="green"
        textColor={colors.mainGreen}
        spinnerColor={colors.mainGreen}
        onClick={openModal}
        outline
      >
        <IconWrapper>
          <Icon src={StatisticsImg} />
        </IconWrapper>
        Afficher les statistiques
      </StyledButton>
      <Modal
        ariaHideApp={false}
        isOpened={modalOpened}
        style={modalStyle(width)}
        onClose={closeModal}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={currentData?.ages}>
              <XAxis dataKey="ageGroup" />
              <YAxis dataKey="sum" />
              <CartesianGrid strokeDasharray="10 1" />
              {/*<Tooltip />*/}
              <Line dataKey="sum" stroke={colors.lilac} />
              {filters.female && <Line dataKey="female" stroke={colors.mainPink} />}
              {filters.male && <Line dataKey="male" stroke={colors.mainGreen} />}
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Modal>
    </LongBox>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getStatisticsChart: (data: GetLibraryStatisticsActionData) =>
      dispatch(getLibraryStatisticsChartAction(data)),
    getProfessions: () => dispatch(getProfessionsAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  libraries: makeSelectLibraries(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LibraryStatisticsSelector);
