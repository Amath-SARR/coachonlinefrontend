/**
 *
 * LoginPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';
// import { FormattedMessage } from 'react-intl';
import makeSelectAuth from '../selectors';
import { loginGoogleAction, logIntoAccountAction } from '../actions';
import { Ia, Obama } from '../../../components/messages';
import { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import useWindowSize from '../../../hooks/useWindowSize';
import history, { replaceFromBackground } from '../../../utils/history';
// import Label from '../../../components/Label';
import { authModalStyles, InnerWrapper } from '../index';
import { yupValidators } from '../../../utils/validate';
import LoginForm from '../../../components/LoginForm/login-form';
// import { FlexRow } from '../../../global-styles';
// import { Display } from 'styled-icons/bootstrap';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';

const LogoForm = require('../../../../app/images/images/logo1.png');
const Yoga = require('../../../../app/images/images/yoga.png');
const Union = require('../../../../app/images/images/union.png');

const Container = styled.div`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  color: white;
  //margin-left: 10px;
`;

/* Centered text */
const Centered = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  transform: translate(-50%, -50%);
  background: linear-gradient(180deg, #40e0d0 0%, #ff8c00 47.4%, #ff0080 100%);
  background-clip: text;
  text-transform: uppercase;
  font-size: 40px;
  text-align: justify;
  font-style: normal;
  font-family: sans-serif;
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Button1 = styled.button`
  position: absolute;
  top: 80%;
  left: 40%;
  display: flex;
  padding: 10px 32px;
  align-items: flex-end;
  cursor: pointer;
  border-radius: 14px;
  border: 1px solid var(--rose, #fff);
  background: var(--rose, #fff);
  //margin-top: 80px;
`;

// const Links = styled.a`
//   text-decoration: none;
// `;

const registerSchema = yup.object().shape({
  email: yupValidators.email,
  password: yup
    .string()
    .min(5, 'Le mot de passe doit comporter au moins 5 caractères')
    .matches(/^\S+$/, "Aucun espace n'est autorisé")
    .required(),
});

export function LoginPage({ logIntoAccount, loginGoogle, auth }) {
  const { width } = useWindowSize();
  const location = useLocation();
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(true);
  }, []);

  useEffect(() => {
    if (history.location?.search.includes('email_confirmed')) {
      toast.success('Votre e-mail a été confirmé. Vous pouvez vous connecter maintenant');
    }
    !!auth.authToken && history.replace('/');
  }, []);

  const closeModal = () => {
    setOpened(false);
    console.log(location);
    setTimeout(() => replaceFromBackground({ history, location }), 200);
  };

  const navigate = (path) => {
    setOpened(false);
    history.replace(path, {
      background: location?.state?.background,
    });
  };

  const onSubmit = (data) => logIntoAccount(data);

  const responseGoogle = (data) => {
    loginGoogle({ tokenId: data?.tokenId });
  };

  const failureGoogle = (error) => {
    console.log(error);
    toast.error(`Google authorization is not available at the moment. Reason: ${error.details}`);
  };

  const modalStyle = authModalStyles(width);
  return (
    // <Modal
    //   ariaHideApp={false}
    //   isOpened={opened}
    //   style={modalStyle}
    //   onClose={closeModal}
    //   overlayClassName="transition"
    //   withHeader
    //   backButtonHidden
    //   headerTitle={<FormattedMessage {...messages.welcome} />}
    //   headerDescription={<FormattedMessage {...messages.logInto} />}
    // >
    <InnerWrapper>
      <div style={{ width: '850px' }}>
        <Carousel
          autoPlay
          infiniteLoop
          transitionTime={1000}
          showStatus={false}
          showThumbs={false}
          showArrows={false}
          interval={2000}
        >
          <Container>
            <img src={Yoga} alt="" style={{ width: 500, height: 500 }} />
            <Centered>Yoga Iyengar de tous les jours</Centered>
            <Button1>
              <p>Découvir</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                />
              </svg>
            </Button1>
          </Container>
          <Container>
            <img src={Union} alt="" style={{ width: 500, height: 500 }} />
            <Button1>
              <p>Découvir</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                />
              </svg>
            </Button1>
          </Container>
          <Container>
            <img src={Obama} alt="" style={{ width: 500, height: 500 }} />
            <Centered>Parler comme Obama</Centered>
            <Button1>
              <p>Découvir</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                />
              </svg>
            </Button1>
          </Container>
          <Container>
            <img src={Ia} alt="" style={{ width: 500, height: 500 }} />
            <Centered>IA, le métier d'avenir</Centered>
            <Button1>
              <p>Découvir</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                />
              </svg>
            </Button1>
          </Container>
        </Carousel>
      </div>
      <div>
        <ModalHeaderTitle>
          <img src={LogoForm} alt="" />
        </ModalHeaderTitle>
        <ModalHeaderDescription>
          Connecter-vous
          {/* <FormattedMessage {...messages.logInto} /> */}
        </ModalHeaderDescription>
        <LoginForm />
        {/* <Label
          labelName={messages.registerAsStudent}
          onClick={() => navigate('/auth/register/student')}
        /> */}
        {/* <Label onClick={() => navigate('/auth/register/student')} className={'dev-only'} labelName="S'inscrire comme Ca" />   */}

        {/* <WideButton
          className={'dev-only'}
          color="green"
          disableOnFetch
          onClick={() => navigate('/auth/register')}
        >S'inscrire</WideButton> */}
        {/*   <FormattedMessage {...messages.registerAsStudent} />
        </WideButton> */}
        {/* <WideButton
          className={'dev-only'}
          outline
          color="green"
          disableOnFetch
          onClick={() => navigate('/auth/register/coach')}
        >
          <FormattedMessage {...messages.registerAsCoach} />
        </WideButton> */}
      </div>
    </InnerWrapper>
    // </Modal>
  );
}

LoginPage.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    logIntoAccount: (data) => dispatch(logIntoAccountAction(data)),
    loginGoogle: (data) => dispatch(loginGoogleAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoginPage);
