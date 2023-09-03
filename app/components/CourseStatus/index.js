/**
 *
 * CourseStatus
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

// PENDING = 0,
//   REJECTED = 1,
//   APPROVED = 2,
//   UNPUBLISHED = 3

const StatusInfo = styled.div`
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  padding: 15px 30px;
  cursor: pointer;
  border-radius: 5px;
  text-decoration: none;
  border: 1px solid #e5007d;
  background-color: white;
  color: white;
  min-width: 140px;
  @media screen and (max-width: 900px) {
    width: 120px;
    font-size: 11px;
    padding: 15px;
  }
  ${props => props.style};
`;

function CourseStatus({ status, style = {}, tooltip }) {
  const statusText = () => {
    switch (status) {
      case 0:
        return 'EN ATTENTE';
      case 1:
        return 'REJETÉ';
      case 2:
        return 'APPROUVÉ';
      case 3:
        return 'NON PUBLIÉ';
      default:
        return 'EN ATTENTE';
    }
  };

  const statusStyle = () => {
    switch (status) {
      case 0:
        return {
          border: '1px solid orange',
          color: 'orange',
        };
      case 1:
        return {
          border: '1px solid red',
          color: 'red',
        };
      case 2:
        return {
          border: '1px solid green',
          color: 'green',
        };
      case 3:
        return {
          border: '1px solid blue',
          color: 'blue',
        };
      default:
        return {
          border: '1px solid orange',
          color: 'orange',
        };
    }
  };
  const baseStyle = { ...statusStyle(), ...style };
  return (
    <StatusInfo style={baseStyle}>
      <p data-tip={tooltip}>{statusText({ status })}</p>
      {tooltip && <ReactTooltip />}
    </StatusInfo>
  );
}

CourseStatus.propTypes = {};

export default CourseStatus;
