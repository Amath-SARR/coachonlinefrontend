/**
 *
 * RegisterPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import makeSelectAuth from '../selectors';
import {
  createAccountAction,
  createAccountGoogleAction,
  getAffiliateHostAction,
  loginGoogleAction,
} from '../actions';
import messages from '../../../components/messages';
import { InnerWrapper } from '../index';
import { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import makeSelectLibraries from '../../Libraries/selectors';
import {
  getInstitutionAction,
  getProfessionsAction,
  registerForInstitutionAction,
} from '../../Libraries/actions';
import RegisterForm from '../../../components/RegisterForm/register-form';
import { writeToStorage } from '../../../utils/storage';
import useQuery from '../../../hooks/useQuery';

export function RegisterPage({}) {
  const { accountType } = useParams();
  const query = useQuery();
  const affiliationToken = query.get('Join');
  const coachAffiliationToken = query.get('Ref');

  const isCoach = accountType === 'coach';

  useEffect(() => {
    !!affiliationToken && storeAffiliationToken(affiliationToken);
    !!coachAffiliationToken && storeCoachAffiliationToken(coachAffiliationToken);
  }, []);

  const submitLabel = () => {
    if (isCoach) {
      return "S'inscrire en tant que coach";
    }
    return "S'inscrire";
  };

  const storeAffiliationToken = (token) => {
    writeToStorage('affiliationToken', token);
  };

  const storeCoachAffiliationToken = (token) => {
    writeToStorage('coachAffiliationToken', token);
  };

  return (
    <InnerWrapper>
      <ModalHeaderTitle>
        <FormattedMessage {...messages.registrationTitle} />
      </ModalHeaderTitle>
      <ModalHeaderDescription>
        <FormattedMessage {...messages.registerNewAccount} />
      </ModalHeaderDescription>{' '}
      <RegisterForm submitLabel={submitLabel()} accountType={accountType} />
    </InnerWrapper>
  );
}

RegisterPage.propTypes = {
  dispatch: PropTypes.func,
  createAccount: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  libraries: makeSelectLibraries(),
});

function mapDispatchToProps(dispatch) {
  return {
    createAccount: (data) => dispatch(createAccountAction(data)),
    createAccountGoogle: (data) => dispatch(createAccountGoogleAction(data)),
    loginGoogle: (data) => dispatch(loginGoogleAction(data)),
    getAffiliateHost: (token) => dispatch(getAffiliateHostAction(token)),
    getProfessions: () => dispatch(getProfessionsAction()),
    getInstitutionInfo: (data) => dispatch(getInstitutionAction(data)),
    registerWithInstitution: (data) => dispatch(registerForInstitutionAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(RegisterPage);
