/**
 *
 * Affiliation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectAffiliation from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Affiliation() {
  useInjectReducer({ key: 'affiliation', reducer });
  useInjectSaga({ key: 'affiliation', saga });

  return <div />;
}

Affiliation.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  affiliation: makeSelectAffiliation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Affiliation);
