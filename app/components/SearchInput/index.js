/**
 *
 * SearchInput
 * Barre de recherche du Header (call in HeadingLogo)
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import { Search } from '@styled-icons/ionicons-solid/Search';
import { colors } from '../../utils/colors';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import Image from '../Image';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { getCategoriesAction } from '../../containers/Dashboard/actions';
import './style.css';

const Listbox = styled.ul`
  margin: 0,
  padding: 0,

  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 300px;
  height: 530px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  margin-left: -15px;
  overflow: scroll;
  border: 1px solid #fff;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.lilac};
  width: 100%;
  border-right: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  height: 34px;
  @media screen and (max-width: 920px) {
    width: 170px;
  }
`;
const Input = styled.input`
  flex: 3;
  outline: none;
  border: none;
  box-shadow: none;
  background: #fff;
  margin: 0;
  color: ${colors.lilac};
  min-width: 200px;
  height: 40px;
  font-size: 16px;
`;
const IconWrapper = styled.div`
  flex: 0.5;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -20px;
  //opacity: 0.6;
  background-color: ${colors.lilac};
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
// const Icon = styled(Search)`
//   width: auto !important;
//   height: 100% !important;
//   padding: 0 !important;
//   color: whiteimport CategoriesManager from './../CategoriesManager/index';
// `;

function SearchInput({ onChange, onSearch, style, dashboard, getCategories }) {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  const onInputChange = (event) => {
    setInputValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  const onSearchPress = () => {
    onSearch && onSearch(inputValue);
  };

  const onInputClear = () => {
    setInputValue('');
    inputRef?.current?.focus();
    onClear && onClear();
  };

  const onKeyPress = (event) => {
    event.key === 'Enter' && onSearchPress();
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
    <datalist id="suggestions">
      {listeSousCategories(dashboard).map((category) =>
       category.map((category)=><option>{category.name}</option>))}
    </datalist>
    <input
      autoComplete="on" list="suggestions"
      ref={inputRef}
      value={inputValue}
      onChange={onInputChange}
      onKeyPress={onKeyPress}
      placeholder="Rechercher..."
      style={{ minWidth: 200, height: 40 }}
    />
  </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCategories: () => dispatch(getCategoriesAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
  dashboard: makeSelectDashboard(),
});

function listeCategories(dashboard) {
  return dashboard?.categories.map((category, index) => category);
}

function listeSousCategories(dashboard) {
  return listeCategories(dashboard)?.map((category, index) => category.children);
}

// function listeSousCategories(dashboard) {
//   const listSousCategories = dashboard?.categories.map((category, index) => category.children);
//   const listes = [];
//   let i = 0;
//   for (; i < listSousCategories.length; i++) {
//     listes[i] = listSousCategories[i].map((category, index) => category.name);
//   }
//   return listes;
// }

const withConnect = connect(mapStateToProps, mapDispatchToProps);

SearchInput.propTypes = {};

export default compose(withConnect, memo)(SearchInput);
//export default SearchInput;
