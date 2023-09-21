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
//import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { forEach } from 'lodash';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

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
  min-width: 50px;
  height: 20px;
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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

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

  const { getInputProps, getRootProps, getListboxProps, getOptionProps, groupedOptions } =
    useAutocomplete({
      options: liste(dashboard), //.map((option) => option),
      getOptionLabel: (option) => option[index],
    });
  // var listSousCategories ,

  const defprops = {
    //liste(dashboard)
    //options: liste(dashboard).map((option) => option.name),
    //getOptionLabel: (options) => options.name
    options: liste(dashboard), //.map((option,index) => option[index]),
    getOptionLabel: (option) => option,
  };
  // const getdata = (data) => {
  //     console.log(data);
  // }
  return (
    <Wrapper>
      {/* <Input
        onClick={autoComplete}
        ref={inputRef}
        value={inputValue}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        placeholder="Rechercher..."
      /> */}
      {/* <IconWrapper
        style={{ visibility: !inputValue ? 'hidden' : 'visible' }}
        onClick={onInputClear}
      >
        <Icon src={CancelImg} />
      </IconWrapper> ref: inputRef ,
        value: getInputProps, */}

      {/* <div>
        <div {...getRootProps()}>
          <Input {...getInputProps()} placeholder="Rechercher..." onKeyPress={onKeyPress} />
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li>{option}</li>
            ))}
          </Listbox>
        ) : null}
      </div>
      {console.log(liste(dashboard))} */}
      {/* <Autocomplete
          //{...defprops}
          style={{width: '300px'}}
          renderInput={(params) => (
            <TextField {...params} label="Rechercher..." variant="standard"></TextField>
          )}
          onChange={(event, value) => getdata(value)}
      /> */}
      {/* <IconWrapper onClick={onSearchPress}>
        <Icon />
      </IconWrapper> */}
      <div>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <datalist id="suggestions">
            <option>First option</option>
            <option>Second Option</option>
            <option>tree Option</option>
            <option>option</option>
            <option>hello</option>
          </datalist>
          <StyledInputBase
            autoComplete="on" list="suggestions"
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            placeholder="Rechercher..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        {/* <input autoComplete="on" list="suggestions" /> */}
        <Input

        />
      </div>
    </Wrapper>
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

// function getSousCategories() {
//   return (
//     //listSousCategorie: () =>
//     dashboard?.categories.map((category,index) => listSousCategories = category?.childCategories);
//     //console.log(listSousCategories);
//   )
// }

function liste(dashboard) {
  const listSousCategories = dashboard?.categories.map((category, index) => category.children);
  const listes = [];
  let i = 0;
  for (; i < listSousCategories.length; i++) {
    listes[i] = listSousCategories[i].map((category, index) => category.name);
  }
  return listes;
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

SearchInput.propTypes = {};

export default compose(withConnect, memo)(SearchInput);
//export default SearchInput;
