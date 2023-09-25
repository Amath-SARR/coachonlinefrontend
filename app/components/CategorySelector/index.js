/**
 *
 * CategorySelector
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import { colors } from '../../utils/colors';
// import makeSelectAuth from '../../containers/Auth/selectors';

const Wrapper = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 10px;
  color: ${colors.white};
  padding-left: 10px;
`;
const Collapsable = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  background-color: ${colors.white};
  color: ${colors.inputBlue};
  //border-radius: 5px;
  padding: 10px;
  outline: none;
  border: none;
`;
export const Category = styled.div`
  font-size: 14px;
  font-weight: 400;
  width: fit-content;
  color: ${colors.lilac};
  background-color: ${colors.white};
  //padding: 8px;
  //border-radius: 5px;
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  border-radius: 10px;
  border: 1px solid var(--dark-grey, #8C8C94);
    margin: 0 5px 5px 0;
    cursor: pointer;
    //${(props) => props.style};
    &:hover {
      background-color: ${colors.lilac};
      color: ${colors.white};
    }
`;
//${(props) => (props.isSelected ? colors.mainGold : colors.inputBlue)};
function CategorySelector({ categories, labelTx, onChange = (category) => null, selected }) {
  const [open, setOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(selected);

  useEffect(() => {
    setSelectedCategory(selected);
  }, [selected?.id]);

  const onCategorySelect = (category) => {
    setSelectedCategory(category);
    onChange(category);
  };

  const renderCategories = () =>
    categories?.map((category) => (
      <Category
        key={category?.id}
        isSelected={selectedCategory?.id === category?.id}
        onClick={() => onCategorySelect(category)}
      >
        {category.name}
      </Category>
    ));
  return (
    <Wrapper>
      {!!labelTx && (
        <Label>
          <FormattedMessage {...labelTx} />
        </Label>
      )}
      <Collapsable>{renderCategories()}</Collapsable>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CategorySelector);
