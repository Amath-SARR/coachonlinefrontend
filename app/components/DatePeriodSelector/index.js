/**
 *
 * DatePeriodSelector
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DateInput } from 'grommet';
import { colors } from '../../utils/colors';
import { getFirstDayOfMonth } from '../../utils/localize';

const Wrapper = styled.div``;
const Label = styled.p`
  font-weight: 600;
  font-size: 17px;
  color: ${(props) => (props.dark ? colors.white : colors.black)};
  width: 50%;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  background-color: ${(props) => (props.dark ? colors.inputBlue : colors.primaryBackgroundLight)};
  color: ${(props) => (props.dark ? colors.white : colors.black)};
  border-radius: 5px;
  outline: none;
  border: none;
  align-items: center;
  padding-left: 10px;
`;

const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_YEAR = 31540000000;

function DatePeriodSelector({
  onChange: onDatesChange = ([startDate, endDate]) => null,
  initDates = [getFirstDayOfMonth(), new Date()],
  dark,
}) {
  const [startDate, setStartDate] = useState(initDates[0]);
  const [startDateISO, setStartDateISO] = useState();
  const [endDate, setEndDate] = useState(initDates[1]);
  const [endDateISO, setEndDateISO] = useState();

  useEffect(() => {
    initDates?.length && convertInitValues();
  }, []);

  const convertInitValues = () => {
    const [beginDate, finishDate] = initDates;
    setStartDate(beginDate);
    setStartDateISO(beginDate.toISOString());
    setEndDate(finishDate);
    setEndDateISO(finishDate.toISOString());
    onChange(beginDate.toISOString(), finishDate.toISOString());
  };

  const onStartDateChange = (event) => {
    const value = event?.value;
    const newDate = new Date(value);
    setStartDate(newDate);
    setStartDateISO(value);
    if (newDate > endDate) {
      const nextDay = new Date(newDate.getTime() + MILLISECONDS_IN_DAY);
      setEndDate(nextDay);
      setEndDateISO(nextDay.toISOString());
      return onChange(value, nextDay.toISOString());
    }
    return onChange(value);
  };

  const onEndDateChange = (event) => {
    const value = event?.value;
    setEndDate(new Date(value));
    setEndDateISO(value);
    return onChange(startDateISO, value);
  };

  const onChange = (startDate = startDateISO, endDate = endDateISO) => {
    onDatesChange([startDate, endDate]);
  };

  const bounds = () => [
    new Date(startDate.getTime() + MILLISECONDS_IN_DAY).toISOString(),
    new Date(new Date().getTime() + MILLISECONDS_IN_YEAR).toISOString(),
  ];

  return (
    <Wrapper>
      <Wrapper>
        <InputWrapper dark={dark}>
          <Label dark={dark}>De</Label>
          <DateInput
            onChange={onStartDateChange}
            format="dd/mm/yyyy"
            value={startDateISO}
            calendarProps={{
              size: 'medium',
              margin: 'medium',
              // bounds: bounds(),
            }}
            inputProps={{
              reverse: false,
              style: { border: 'none', boxShadow: 'none' },
              placeholder: 'DD/MM/YYYY',
              icon: null,
            }}
          />
        </InputWrapper>
        <InputWrapper dark={dark}>
          <Label dark={dark}>à</Label>
          <DateInput
            onChange={onEndDateChange}
            format="dd/mm/yyyy"
            value={endDateISO}
            calendarProps={{
              size: 'medium',
              margin: 'medium',
              bounds: bounds(),
            }}
            inputProps={{
              reverse: false,
              style: { border: 'none', boxShadow: 'none' },
              placeholder: 'DD/MM/YYYY',
              icon: null,
            }}
          />
        </InputWrapper>
      </Wrapper>
    </Wrapper>
  );
}

export default DatePeriodSelector;
