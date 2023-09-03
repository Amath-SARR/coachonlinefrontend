/**
 *
 * PaypalButton
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APPLICATION_URL, PAYPAL_APP_ID } from '../../config/env';

const Wrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
`;
const ButtonContainer = styled.span`
  a {
    border-radius: 0;
  }
`;

export const paypalSetup = {
  appid: PAYPAL_APP_ID,
  authend: process.env.TARGET_ENV === 'production' ? 'production' : 'sandbox',
  scopes: 'openid email https://uri.paypal.com/services/paypalattributes',
  containerid: 'paypalButton',
  responseType: 'code id_token',
  locale: process.env.TARGET_ENV === 'production' ? 'fr-fr' : 'en-en',
  buttonType: 'CWP',
  buttonSize: 'lg',
  buttonShape: 'rectangle',
  fullpage: 'true',
  returnurl: `${APPLICATION_URL}billing`,
};

function PaypalButton({ paypalSetupProps = {} }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/js/external/api.js';
    script.async = true;
    script.onload = () => onScriptLoad();

    document.body.appendChild(script);
  }, []);

  const onScriptLoad = (ev) => {
    console.log('Paypal script loaded', ev);
    setLoading(false);
    paypalLogin();
  };

  const paypalLogin = () => {
    const setupOptions = { ...paypalSetup, ...paypalSetupProps };
    console.log('Paypal setup options', setupOptions);
    window.paypal?.use(['login'], function (login) {
      login.render(setupOptions);
    });
  };
  return (
    <Wrapper>
      <ButtonContainer id="paypalButton" />
    </Wrapper>
  );
}

PaypalButton.propTypes = {};

export default PaypalButton;
