/**
 *
 * Button
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { colors } from '../../utils/colors';
import { readFromStorage } from '../../utils/storage';
import { createStructuredSelector } from 'reselect';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  //background-color: ${colors.mainPink};
  color: white;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  font-size: 16px;
  width: 100%;
  font-weight: 500;
  padding: 10px;
  margin: 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 10px;
  text-decoration: none;
  border: 2px solid #e5007d;
  text-align: center;
  @media screen and (max-width: 920px) {
    font-size: 12px;
  }
  @media screen and (max-width: 680px) {
    padding: 15px 15px;
  }
`;
const LoaderWrapper = styled.div`
  margin-right: 5px;
`;

function Button(props) {
  const { style = {}, homePage, ...rest } = props;

  const color = () => {
    switch (props.color) {
      case 'pink':
        return {
          backgroundColor: props.outline ? 'transparent' : colors.mainPink,
          borderColor: colors.mainPink,
          spinnerColor: props.spinnerColor || colors.white,
          color: props.textColor || colors.white,
          fontWeight: 500,
        };
      case 'green':
        return {
          backgroundColor: props.outline ? 'transparent' : colors.mainGreen,
          borderColor: colors.mainGreen,
          spinnerColor: props.spinnerColor || colors.white,
          color:
            props.textColor || (props.spinnerColor || props.outline ? colors.black : colors.black),
        };
      case 'white':
        return {
          backgroundColor: colors.primaryBackgroundLight,
          borderColor: colors.primaryBackgroundLight,
          color:
            props.textColor || (props.spinnerColor || props.outline ? colors.white : colors.black),

          spinnerColor: props.spinnerColor || colors.mainPink,
        };
      case 'gold':
        return {
          backgroundColor: props.outline ? 'transparent' : colors.mainGold,
          borderColor: colors.mainGold,
          spinnerColor: colors.black,
          color:
            props.textColor || (props.spinnerColor || props.outline ? colors.white : colors.black),
        };
      case 'blue':
        return {
          backgroundColor: props.outline ? 'transparent' : colors.mainBlue,
          borderColor: colors.mainBlue,
          spinnerColor: colors.white,
          color: props.textColor || props.spinnerColor || colors.white,
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          borderColor: props.color,
          spinnerColor: colors.white,
          color: colors.white,
        };
      default:
        return {
          backgroundColor: props.outline ? 'transparent' : props.color,
          borderColor: props.color,
          spinnerColor: props.spinnerColor || props.textColor || colors.white,
          color:
            props.textColor || props.spinnerColor || props.outline ? colors.white : colors.black,
        };
    }
  };

  const isLoading = props.isLoading || (props.showLoader && homePage.isLoading);

  const disabled = props.isLoading || (props.disableOnFetch && homePage.isLoading);

  return (
    <ButtonWrapper
      as={props.as || props.to ? Link : ButtonWrapper}
      style={{ ...color(), ...style }}
      to={props.to}
      onClick={(ev) => !props.disabled && !isLoading && props.onClick(ev)}
      className={props.className}
      disabled={props.disabled || disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <LoaderWrapper>
          <Loader type="Oval" color={color().spinnerColor} height={15} width={15} />
        </LoaderWrapper>
      )}
      {props.children}
    </ButtonWrapper>
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

export default compose(withConnect)(Button);
