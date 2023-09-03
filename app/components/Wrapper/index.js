/**
 *
 * Wrapper
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import bgImage from './images/bg.jpg';

function Wrapper(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundImage: `url("${bgImage}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundColor: '#00000080',
        backgroundBlendMode: 'multiply',
        position: 'absolute',
      }}
    >
      {props.children}
    </div>
  );
}

Wrapper.propTypes = {};

export default memo(Wrapper);
