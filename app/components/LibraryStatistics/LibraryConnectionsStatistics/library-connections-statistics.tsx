/**
 *
 * LibraryConnectionsStatistics
 *
 */

import React, { FC, useEffect, useState } from 'react';
import LibraryConnectionsStatisticsProps from './library-connections-statistics.props';
import styled from 'styled-components';
import { DispatchType } from '../../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { LongBox } from '../../../containers/Profile/B2BProfilePage';
import SelectInput from '../../SelectInput';
import {
  generateXLSXAction,
  getLibraryConnectionStatisticsAction,
} from '../../../containers/Libraries/actions';
import makeSelectAuth from '../../../containers/Auth/selectors';
import { getFirstDayOfMonth, getFirstDayOfYear } from '../../../utils/localize';
import { FlexColumn, FlexRow, Text } from '../../../global-styles';
import DatePeriodSelector from '../../DatePeriodSelector';
import { LibraryConnectionStatistics } from '../../../containers/Libraries/reducer.types';
import { GetLibraryConnectionStatisticsActionData } from '../../../containers/Libraries/actions.types';
import {
  Pie,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Brush,
} from 'recharts';
import { colors } from '../../../utils/colors';
import SortableTable from '../../SortableTable/sortable-table';
import { sortByStringKey } from '../../../utils/arrayUtils';
import Button from '../../Button';

const Wrapper = styled(LongBox)`
  width: 100%;
  overflow: visible;
`;
const Col = styled(FlexColumn)`
  margin: 20px 0;
`;
const Row = styled(FlexRow)`
  width: 100%;
  justify-content: flex-end;
`;
const ChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  margin: 20px 0;
`;
const TableWrapper = styled.div`
  border-radius: 10px;
  padding: 10px;
  background-color: ${colors.inputBlue};
  width: 100%;
  margin: 10px 20px;
`;
export const acceptedKeys = [
  {
    label: 'Profession',
    value: 'PROFESSION',
    chartType: 'bar',
  },
  {
    label: 'Âge',
    value: 'AGE',
    chartType: 'bar',
  },
  {
    label: 'Genre',
    value: 'GENDER',
    chartType: 'pie',
  },
  {
    label: 'Ville',
    value: 'CITY',
    chartType: 'bar',
  },
  {
    label: 'Région',
    value: 'REGION',
    chartType: 'pie',
  },
];

const HEADERS = [
  {
    key: 'name',
    label: 'Nom',
    canSort: true,
    style: {
      textAlign: 'left',
    },
  },
  {
    key: 'totalRegisteredUsers',
    label: 'Total des utilisateurs enregistrés',
    canSort: true,
    style: {
      textAlign: 'center',
    },
  },
  // {
  //   key: 'totalConnections',
  //   label: 'Total connections',
  //   canSort: true,
  //   style: {
  //     textAlign: 'center',
  //   },
  // },
];

const Chart: FC<{ chartType: string; data: LibraryConnectionStatistics['data'] }> = ({
  chartType,
  data,
}) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabelForPieChart = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * 1.5 * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * 1.5 * Math.sin(-midAngle * RADIAN);

    const percentage = (percent * 100).toFixed(0);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${percentage < 1 ? 'Other' : data[index]?.name} (${percentage}%)`}
      </text>
    );
  };
  const renderCustomizedLabelForBarChart = (value, name) => {
    let label = name;
    switch (name) {
      case 'totalRegisteredUsers':
        label = 'Total des utilisateurs enregistrés';
        break;
    }
    return [value, label];
  };
  switch (chartType) {
    case 'pie':
      const sortedData = data?.sort((a, b) =>
        a.totalRegisteredUsers > b.totalRegisteredUsers ? -1 : 1,
      );
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="totalRegisteredUsers"
              isAnimationActive={true}
              data={sortedData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              fill="#8884d8"
              label={renderCustomizedLabelForPieChart}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={renderCustomizedLabelForBarChart} />
            {/*<Brush dataKey="name" height={30} stroke="#8884d8" />*/}
            <Bar dataKey="totalRegisteredUsers" fill={colors.mainGreen} />
            {/*<Bar dataKey="totalConnections" fill={colors.mainPink} />*/}
          </BarChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};

const TableItem = (props: { item: LibraryConnectionStatistics['data'][number] }) => {
  const { item } = props;
  return (
    <>
      <td style={{ textAlign: 'left', color: colors.white }}>{item.name}</td>
      <td style={{ textAlign: 'center', color: colors.white }}>{item.totalRegisteredUsers}</td>
      {/*<td style={{ textAlign: 'center', color: colors.white }}>{item.totalConnections}</td>*/}
    </>
  );
};

function LibraryConnectionsStatistics(props: LibraryConnectionsStatisticsProps) {
  const {
    getStats = (data: GetLibraryConnectionStatisticsActionData) => null,
    generateXLSX = (data: GetLibraryConnectionStatisticsActionData) => null,
    auth,
    id,
  } = props;
  const defaultOption = acceptedKeys[0];

  const [selectedOption, setSelectedOption] = useState<typeof acceptedKeys[number]>(defaultOption);
  const [dates, setDates] = useState<[string, string]>([
    getFirstDayOfYear().toISOString(),
    new Date().toISOString(),
  ]);
  const [stats, setStats] = useState<LibraryConnectionStatistics | null>(null);

  const updateStringTrigger = `${selectedOption.value}${dates[0]}${dates[1]}`;

  useEffect(() => {
    fetchConnectionStatistics({ key: selectedOption.value, from: dates[0], to: dates[1] });
  }, [updateStringTrigger]);

  const fetchConnectionStatistics = (data: {
    key: typeof acceptedKeys[number]['value'];
    from: string;
    to: string;
  }) => {
    const { key, from, to } = data;
    getStats({
      body: { id, token: auth?.authToken, key, from, to },
      actions: {
        onSuccess: (stats: LibraryConnectionStatistics) => {
          setStats(stats);
        },
      },
    });
  };

  const getXLSX = (data: {
    key: typeof acceptedKeys[number]['value'];
    from: string;
    to: string;
  }) => {
    const { key, from, to } = data;
    generateXLSX({
      body: { id, token: auth?.authToken, key, from, to },
    });
  };

  const onOptionChange = (option: typeof acceptedKeys[number]) => {
    console.log(option);
    setSelectedOption(option);
  };

  const onDateChange = (dates: [string, string]): void => {
    setDates(dates);
  };

  const onSort = (key, increasingly) => {
    setStats({ ...stats, data: sortByStringKey(stats?.data, key, { increasingly }) });
  };

  return (
    <Wrapper>
      <Row>
        <Button
          color={'green'}
          style={{ width: 'fit-content' }}
          onClick={() => getXLSX({ key: selectedOption.value, from: dates[0], to: dates[1] })}
        >
          Generate XLSX
        </Button>
      </Row>
      <Col>
        <SelectInput
          redesigned
          defaultValue2={defaultOption}
          onChange={onOptionChange}
          options={acceptedKeys}
        />
        <DatePeriodSelector
          dark
          initDates={[new Date(dates[0]), new Date(dates[1])]}
          onChange={onDateChange}
        />
      </Col>
      <ChartWrapper>
        {!!stats ? (
          <Chart chartType={selectedOption.chartType} data={stats.data} />
        ) : (
          <Text>No chart data</Text>
        )}
      </ChartWrapper>
      <TableWrapper>
        {!!stats?.data ? (
          <SortableTable
            data={stats?.data}
            headers={HEADERS}
            ItemComponent={({ item }) => <TableItem item={item} />}
            onItemClick={(item) => null}
            sort={(key, sortingIncreasingly) => onSort(key, sortingIncreasingly)}
            emptyListComponent={
              "Vous n'avez pas encore soumis de cours. Pour soumettre votre premier cours, cliquez sur le bouton ci-dessous"
            }
          />
        ) : (
          <Text>No data</Text>
        )}
      </TableWrapper>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getStats: (data) => dispatch(getLibraryConnectionStatisticsAction(data)),
    generateXLSX: (data) => dispatch(generateXLSXAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LibraryConnectionsStatistics);
