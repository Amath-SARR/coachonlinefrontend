/**
 *
 * DatePicker
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import { DateInput, MaskedInput, Menu } from 'grommet';
import { colors } from '../../utils/colors';
import messages from '../messages';
import Image from '../Image';
import { isValidDate, localizeDate } from '../../utils/localize';
// import makeSelectAuth from '../../containers/Auth/selectors';
const ClockIcon = require('../../images/icons/clock.svg');
const CalendarIcon = require('../../images/icons/calendar.svg');

const Wrapper = styled.div`
  margin-bottom: 15px;
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Label = styled.p`
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 10px;
  color: ${colors.white};
  padding-left: 10px;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  background-color: ${colors.inputBlue};
  color: ${colors.white};
  border-radius: 5px;
  padding: 10px;
  outline: none;
  border: none;
`;

const array23h = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

function DatePicker({ labelTx, onChange, initDates = [] }) {
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [duration, setDuration] = useState();

  useEffect(() => {
    initDates?.length && convertInitValues();
  }, [initDates[0], initDates[1]]);

  const convertInitValues = () => {
    const [startDate, endDate] = initDates;
    const beginDate = new Date(startDate);
    const finishDate = new Date(endDate);
    if (beginDate.getTime() > 0 && finishDate.getTime() > 0) {
      const startTime = `${beginDate.getHours()}:${beginDate.getMinutes()}`;
      const durationInMilliseconds = finishDate.getTime() - beginDate.getTime();
      setDate(beginDate.toISOString());
      setTime(startTime);
      setDuration(`${(durationInMilliseconds / 1000 / 60 / 60).toString()} hours`);
    }
  };

  const onDate = (event) => {
    const value = event?.value;
    setDate(value);
    onChange && onChange(convertDataToSend({ time, duration, date: value }));
  };
  const onTime = (event) => {
    const { value } = event.target;
    setTime(value);
    onChange && onChange(convertDataToSend({ date, duration, time: value }));
  };
  const onDuration = (event) => {
    const { value } = event.target;
    setDuration(value);
    onChange && onChange(convertDataToSend({ time, date, duration: value }));
  };

  const convertDataToSend = ({ date = date, time = time, duration = duration }) => {
    if (date && time && duration) {
      const eventDateLocalTime = new Date(date);
      const durationMilliseconds = convertDurationToMilliseconds(duration);
      const startTimeMilliseconds = convertStartTimeToMilliseconds(time);
      const eventDateMilliseconds = eventDateLocalTime.getTime();
      const startDateMilliseconds = eventDateMilliseconds + startTimeMilliseconds;
      const endDate = new Date(startDateMilliseconds + durationMilliseconds);
      return [new Date(startDateMilliseconds).toISOString(), endDate.toISOString()];
    }
    return [];
  };

  const convertStartTimeToMilliseconds = (value) => {
    if (value) {
      const arr = value?.split(':');
      return (Number(arr[0]) * 60 * 60 + Number(arr[1]) * 60) * 1000;
    }
  };

  const convertDurationToMilliseconds = (value) => {
    if (value) {
      const arr = value?.split(' ');
      return Number(arr[0]) * 60 * 60 * 1000;
    }
  };

  const bounds = () => {
    const MILLISECONDS_IN_DAY = 86400000;
    const MILLISECONDS_IN_YEAR = 31540000000;
    return [
      new Date(Date.now() - MILLISECONDS_IN_DAY).toISOString(),
      new Date(Date.now() + MILLISECONDS_IN_YEAR).toISOString(),
    ];
  };

  return (
    <Wrapper>
      <Wrapper>
        <LabelWrapper>
          <Label>
            <FormattedMessage {...(labelTx || messages.startDate)} />
          </Label>
        </LabelWrapper>
        <InputWrapper>
          <DateInput
            onChange={onDate}
            format="dd/mm/yyyy"
            value={date}
            calendarProps={{
              size: 'medium',
              margin: 'medium',
              bounds: bounds(),
            }}
            inputProps={{
              reverse: false,
              style: { border: 'none', boxShadow: 'none' },
              placeholder: 'DD/MM/YYYY',
              icon: <Image src={CalendarIcon} />,
            }}
          />
          <MaskedInput
            onChange={onTime}
            value={time}
            icon={<Image src={ClockIcon} />}
            mask={[
              {
                length: [1, 2],
                options: array23h,
                regexp: /^1[1-2]$|^[0-9]$/,
                placeholder: 'HH',
              },
              { fixed: ':' },
              {
                length: 2,
                options: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
                regexp: /^[0-5][0-9]$|^[0-9]$/,
                placeholder: 'MM',
              },
            ]}
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </InputWrapper>
      </Wrapper>
      <Wrapper>
        <LabelWrapper>
          <Label>
            <FormattedMessage {...(labelTx || messages.duration)} />
          </Label>
        </LabelWrapper>
        <InputWrapper>
          <MaskedInput
            onChange={onDuration}
            value={duration}
            style={{ border: 'none', boxShadow: 'none' }}
            icon={<Image src={ClockIcon} />}
            mask={[
              {
                length: [1, 2],
                options: array23h,
                regexp: /^1[1-2]$|^[0-9]$/,
                placeholder: 'Duration',
              },
              { fixed: ' hours' },
            ]}
          />
        </InputWrapper>
      </Wrapper>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  // auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DatePicker);
