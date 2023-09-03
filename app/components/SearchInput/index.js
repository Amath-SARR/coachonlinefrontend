/**
 *
 * SearchInput
 * Barre de recherche du Header (call in HeadingLogo)
 *
 */

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Search } from '@styled-icons/ionicons-solid/Search';
import { colors } from '../../utils/colors';
import Image from '../Image';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.lilac};
  width: 400px;
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
  background: transparent;
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
  //opacity: 0.6;
  background-color: ${colors.lilac};
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
const Icon = styled(Search)`
  width: auto !important;
  height: 100% !important;
  padding: 0 !important;
  color: white;
`;

function SearchInput({ onChange, onSearch, onClear, style }) {
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

  return (
    <Wrapper>
      <Input ref={inputRef} value={inputValue} onChange={onInputChange} onKeyPress={onKeyPress} />
      {/* <IconWrapper
        style={{ visibility: !inputValue ? 'hidden' : 'visible' }}
        onClick={onInputClear}
      >
        <Icon src={CancelImg} />
      </IconWrapper> */}
      <IconWrapper onClick={onSearchPress}>
        <Icon />
      </IconWrapper>
    </Wrapper>
  );
}

SearchInput.propTypes = {};

export default SearchInput;
