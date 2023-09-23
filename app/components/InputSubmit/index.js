/**
 *
 * InputSubmit
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
// import Button from '../Button';
// import { colors } from '../../utils/colors';
// import { readFromStorage } from '../../utils/storage';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
// import makeSelectAuth from '../../containers/Auth/selectors';
// import makeSelectDashboard from '../../containers/Dashboard/selectors';
// import makeSelectSubscription from '../../containers/Subscription/selectors';
// import makeSelectB2B from '../../containers/B2B/selectors';
// import makeSelectLibraries from '../../containers/Libraries/selectors';
import makeSelectHomePage from '../../containers/HomePage/selectors';

const Wrapper = styled.div`
  position: relative;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;
const LoaderWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translate(0, -50%);
`;

const Input = styled.input`
  background: ${(props) => (props?.outline ? 'transparent' : props.background)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  border: 2px solid ${(props) => props.background};
  font-size: 16px;
  font-weight: 500;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
  @media screen and (max-width: 920px) {
    font-size: 12px;
  }
  ${({ style }) => style};
`;

function InputSubmit({
  className,
  inputStyle = {},
  isLoading,
  disableOnFetch,
  style = {},
  homePage,
  disabled,
  placeholder,
  value,
  outline,
  color,
  background,
  borderRaduis,
}) {
  const loading = isLoading || (disableOnFetch && homePage.isLoading);

  return (
    <Wrapper className={className} disabled={disabled || isLoading} style={style}>
      {loading && (
        <LoaderWrapper>
          <Loader type="Oval" color={color} height={15} width={15} />
        </LoaderWrapper>
      )}
      <Input
        type="submit"
        style={inputStyle}
        color={color}
        background={background}
        outline={outline}
        value={value}
        placeholder={placeholder}
        disabled={disabled || loading}
        borderRaduis={borderRaduis}
      />
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(InputSubmit);
