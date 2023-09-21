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
import { useParams } from 'react-router-dom';
import makeSelectAuth from '../selectors';
import {
  createAccountAction,
  createAccountGoogleAction,
  getAffiliateHostAction,
  loginGoogleAction,
} from '../actions';
// import messages, { LogoForm, Union, Yoga } from '../../../components/messages';
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
// import { Carousel } from 'react-responsive-carousel';

// const ContainerRegister = styled.div`
//   position: relative;
//   text-align: center;
//   text-transform: uppercase;
//   color: white;
//   //margin-left: 10px;
// `;

/* Centered text */
// const CenteredRegister = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background: linear-gradient(180deg, #40e0d0 0%, #ff8c00 47.4%, #ff0080 100%);
//   background-clip: text;
//   text-transform: uppercase;
//   font-size: 40px;
//   text-align: justify;
//   font-style: normal;
//   font-family: sans-serif;
//   font-weight: 800;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

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
      {/* <div style={{ width: "850px" }} >
          <Carousel autoPlay
            infiniteLoop
            transitionTime={1000}
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            interval={5000}>
            <ContainerRegister>
              <img src={Yoga} alt="" style={{ width: 500, height: 500 }} />
              <CenteredRegister>Yoga Iyengar de tous les jours</CenteredRegister>
            </ContainerRegister>
            <ContainerRegister>
              <img src={Union} alt="" style={{ width: 500, height: 500 }} />
            </ContainerRegister>
            <Container>
            <img src={Oratoir} alt="" style={{ width: 500, height: 500 }} />
            <Centered>Parler comme Obama</Centered>
          </Container>
          <Container>
            <img src={Ia} alt="" style={{ width: 500, height: 500 }} />
            <Centered>IA, le métier d'avenir</Centered>
          </Container>
          </Carousel>
        </div > */}
      <div>
        <ModalHeaderTitle>
          <img src={LogoForm} alt="" />
        </ModalHeaderTitle>
        <ModalHeaderDescription>
          <FormattedMessage {...messages.registerNewAccount} />
        </ModalHeaderDescription>{' '}
        <RegisterForm submitLabel={submitLabel()} accountType={accountType} />
      </div>
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
