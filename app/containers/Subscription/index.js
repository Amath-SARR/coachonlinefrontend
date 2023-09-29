/**
 *
 * Subscription
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '@reduxjs/toolkit';
import { Route, Switch, useLocation } from 'react-router-dom';
import makeSelectSubscription from './selectors';
import useWindowSize from '../../hooks/useWindowSize';
import history from '../../utils/history';
import Modal from '../../components/Modal';
import SubscriptionChoicePage from './SubscriptionChoicePage/Loadable';
import { colors } from '../../utils/colors';
import BillingDetailsPage from './BillingDetailsPage/Loadable';
import StudentCardVerificationPage from './StudentCardVerificationPage/Loadable';
import ProfileDataForBillingPage from './ProfileDataForBillingPage/Loadable';
import SubscriptionSummaryPage from './SubscriptionSummaryPage/Loadable';
import SubscriptionFreePage from './SubscriptionFreePage/Loadable';

export const subscriptionModalStyles = (width) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}E6`,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: `1px solid ${colors.borderDark}`,
    // borderRadius: 24,
    width: '85%',
    maxWidth: 1460,
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

export function Subscription() {
  const { width } = useWindowSize();
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(true);
    //console.log('Subscription modal opened ', location);
  }, []);

  const closeModal = () => {
    setOpened(false);
    //console.log('Subscription location ', location);
    setTimeout(
      () =>
        history.push(location?.state?.background?.pathname || { pathname: '/' }, {
          location: location?.state?.background || { pathname: '/' },
        }),
      300,
    );
  };

  const modalStyle = subscriptionModalStyles(width);
  return (
    <Modal
      ariaHideApp={false}
      isOpened={opened}
      style={modalStyle}
      onClose={closeModal}
      overlayClassName="transition"
      withHeader
      backButtonHidden
    >
      <Switch location={location}>
        <Route path="/subscription/subscriptionChoice" component={SubscriptionChoicePage} />
        <Route path="/subscription/subscriptionChoiceFree" component={SubscriptionFreePage} />
        <Route path="/subscription/profileDetails" component={ProfileDataForBillingPage} />
        <Route path="/subscription/billingDetails" component={BillingDetailsPage} />
        <Route
          path="/subscription/studentCardVerification"
          component={StudentCardVerificationPage}
        />
        <Route path="/subscription/summary" component={SubscriptionSummaryPage} />
      </Switch>
    </Modal>
  );
}

Subscription.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Subscription);
