/**
 *
 * CoachStatistics
 *
 */

import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import {
  getDay,
  getRealMonth,
  getYear,
  toMonthAndYear,
} from '../../utils/localize';
import chevronDown from '../../images/icons/chevron-down--white.png';
import Image from '../Image';
import StatisticsBoxes from '../StatisticsBoxes/Loadable';

const MonthWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Month = styled.p`
  font-size: 26px;
  margin: 15px 30px;
`;
const Chevron = styled(Image)`
  width: 15px;
  height: 15px;
  filter: invert();
  cursor: pointer;
`;

function CoachStatistics({ history, statistics, getMonthStatistics }) {
  const [currentMonth, setCurrentMonth] = useState(getRealMonth());
  const [currentYear, setCurrentYear] = useState(getYear());
  const [monthStatistics, setMonthStatistics] = useState(getRealMonth());

  useEffect(() => {
    getMonthStatistics({ month: currentMonth, year: currentYear });
  }, [currentMonth]);

  useEffect(() => {
    convertToChartData();
  }, [statistics.monthStatistics?.month]);

  const convertToChartData = () => {
    const dailyData = statistics.monthStatistics?.dayBalances;
    const convertedData = dailyData?.map(date => ({
      day: getDay(date.day),
      balance: date.dayBalance,
      minutes: date.totalWatchedMinutes,
    }));
    const sortedByDay = convertedData?.sort((a, b) => (a.day > b.day ? 1 : -1));
    setMonthStatistics(sortedByDay);
  };

  const changeMonth = sign => {
    const nextMonth = currentMonth + sign;
    if (nextMonth < 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else if (nextMonth > 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(nextMonth);
    }
  };

  return (
    <div>
      <MonthWrapper>
        <Chevron
          onClick={() => changeMonth(-1)}
          style={{ transform: 'rotate(90deg)' }}
          src={chevronDown}
        />
        <Month>{toMonthAndYear(statistics.monthStatistics?.month)}</Month>
        <Chevron
          onClick={() => changeMonth(1)}
          style={{ transform: 'rotate(270deg)' }}
          src={chevronDown}
        />
      </MonthWrapper>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={monthStatistics}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="25%"
                stopColor={colors.mainPink}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={colors.mainPink}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid strokeDasharray="5 1" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area
            name={
              statistics.monthStatistics?.dayBalances?.length
                ? `Earnings in ${statistics.monthStatistics?.currency}`
                : 'Aucune données pour ce mois'
            }
            dataKey="balance"
            type="monotone"
            stroke={colors.mainPink}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={monthStatistics}>
          <defs>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="25%"
                stopColor={colors.mainGreen}
                stopOpacity={0.6}
              />
              <stop
                offset="95%"
                stopColor={colors.mainGreen}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid strokeDasharray="5 1" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Area
            name={
              statistics.monthStatistics?.dayBalances?.length
                ? 'Watched minutes'
                : 'Aucune données pour ce mois'
            }
            dataKey="minutes"
            type="monotone"
            stroke={colors.mainGreen}
            fillOpacity={1}
            fill="url(#colorTime)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <StatisticsBoxes currentDate={{ currentMonth, currentYear }} />
    </div>
  );
}

CoachStatistics.propTypes = {};

export default CoachStatistics;
