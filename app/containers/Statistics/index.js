/**
 *
 * Statistics
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectStatistics from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Statistics() {
  useInjectReducer({ key: 'statistics', reducer });
  useInjectSaga({ key: 'statistics', saga });

  return <div />;
}

Statistics.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  statistics: makeSelectStatistics(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Statistics);
