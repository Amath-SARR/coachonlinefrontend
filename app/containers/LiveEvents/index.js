/**
 *
 * LiveEvents
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectLiveEvents from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function LiveEvents() {
  useInjectReducer({ key: 'liveEvents', reducer });
  useInjectSaga({ key: 'liveEvents', saga });

  return (
    <div>
      <Helmet>
        <title>LiveEvents</title>
        <meta name="description" content="Description of LiveEvents" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

LiveEvents.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  liveEvents: makeSelectLiveEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LiveEvents);
