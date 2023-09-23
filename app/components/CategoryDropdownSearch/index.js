/**
 *
 * CategoryDropdownSearch
 * Bouton recherche des catégories du Header (call in HeadingLogo)
 *
 */

import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
// import { ChevronDown } from '@styled-icons/entypo/ChevronDown';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import { colors } from '../../utils/colors';
import Image from '../Image';
import CategoriesIcon from '../../images/icons/categories.svg';
import messages from '../messages';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
import { Category } from '../CategorySelector';
import { getCategoriesAction } from '../../containers/Dashboard/actions';
import { FlexRow } from '../../global-styles';
import Button from '../Button';
const ChevronDown = require('../../images/icons/chevron-down--white.png');


// import makeSelectAuth from '../../containers/Auth/selectors';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.lilac};
  // border-right: none;
  // border-top-left-radius: 8px;
  // border-bottom-left-radius: 8px;
  min-width: 100px;
  padding: 0 10px;
  background: rgb(8, 8, 120);
  height: 40px;
  @media screen and (max-width: 400px) {
    width: 130px;
  }
`;
const Chevron = styled.img`
  width: 10px;
  height: 10px;
  // margin-left: -5px;
  transition: all 0.5s ease-in-out;
  //color: whit;
`;
const IconWrapper = styled.div`
  width: 16px;
  height: 20px;
`;
const Icon = styled(Image)`
  width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  padding: 0 !important;
`;
const Text = styled.p`
  color: #fff;
  font-size: 0.8em;
  word-break: keep-all;
  font-weight: 600;
  margin: 2px 3px;
`;
const Categories = styled(FlexRow)`
  flex-wrap: wrap;
`;
const CategoryItem = styled(Category)`
  font-size: 20px;
  font-weight: 600;
  margin: 0 10px 10px 0;
  color: ${(props) => (props.isSelected ? 'white' : `${colors.lilac}`)};
  background: ${(props) =>
    props.isSelected
      ? `linear-gradient(90deg, ${colors.lilac} 30%, ${colors.mainPink} 100%)`
      : 'transparent'};
`;

export const modalStyles = (width) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}E6`,
    zIndex: 5,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: `2px solid ${colors.lilac}`,
    borderRadius: 24,
    width: 675,
    maxWidth: '100%',
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

const modalStylesCategories = (width) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}E6`,
    zIndex: 5,
  },
  content: {
    // inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    // transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    //background: 'white',
    border: `1px solid ${colors.lilac}`,
    borderRadius: 24,
    display: 'flex',
    width: 1400,
    padding: '28px 66px 60px 66px',
    flexDirection: 'column',
    alignItems: 'flexEnd',
    gap: 8,
    background: 'var(--carte, #F4F4F6)',
    maxWidth: '80%',
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

function CategoryDropdownSearch({
  dashboard,
  getCategories,
  initCategory,
  onSelect: onSelectProp = (val) => null,
}) {
  const { width } = useWindowSize();
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const [childCategories, setChildCategories] = useState([]);

  useEffect(() => {
    setCategory(initCategory);
  }, [initCategory]);

  useEffect(() => {
    getCategories();
  }, []);

  const onSelect = (category) => {
    setCategory(category);
    setChildCategories([]);
  };

  const toggleChildCategory = (category) => {
    const listCopy = JSON.parse(JSON.stringify(childCategories));
    const index = listCopy?.findIndex((cat) => cat.id === category.id);
    if (index >= 0) {
      listCopy?.splice(index, 1);
      setChildCategories(listCopy);
    } else {
      listCopy.push(category);
      setChildCategories(listCopy);
    }
  };

  const initiateSearch = () => {
    if (childCategories?.length) {
      const searchString = childCategories?.map((cat) => cat.name)?.join(',');
      setModalVisible(false);
      return onSelectProp(null, searchString);
    }
    setCategory(category);
    setChildCategories([]);
    setModalVisible(false);
    return onSelectProp(category);
  };

  const toggleModal = (visible) => setModalVisible(visible);

  const hasChildren = !!category?.children?.length;

  return (
    <Wrapper onClick={() => toggleModal(true)}>
      {/* <IconWrapper>
        <Icon src={CategoriesIcon} />
      </IconWrapper> */}
      <Text>{category?.name || <FormattedMessage {...messages.categories} />}</Text>
      <Chevron src={ChevronDown}
        style={{
          transform: modalVisible ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
      <Modal
        withHeader
        backButtonHidden
        overlayClassName="transition-position"
        style={modalStylesCategories(width)}
        onClose={() => toggleModal(false)}
        isOpened={modalVisible}
        headerTitle={<FormattedMessage {...messages.categories} />}
      >
        <Categories
          style={hasChildren ? { borderBottom: '1px solid white', marginBottom: 10, marginLeft:200 } : {}}
        >
          {dashboard?.categories?.map((cat) => (
            <CategoryItem
              key={cat.id}
              isSelected={cat.id === category?.id}
              onClick={() => onSelect(cat)}
            >
              {cat.name}
            </CategoryItem>
          ))}
          <Button
            color="pink"
            style={{ width: 'fit-content', margin: 'auto', marginTop:20 }}
            onClick={initiateSearch}
          >
            Appliquer
          </Button>
        </Categories>
        {/* {hasChildren && (
          <Text style={{ fontSize: '24px', padding: '20px 0' }}>
            <FormattedMessage {...messages.subCategory} />
          </Text>
        )}
        <Categories>
          {category?.children?.map((cat) => (
            <CategoryItem
              key={cat.id}
              isSelected={childCategories?.findIndex((category) => category.id === cat.id) >= 0}
              onClick={() => toggleChildCategory(cat)}
            >
              {cat.name}
            </CategoryItem>
          ))}
        </Categories>
        {!!category && (
          <Button
            color="pink"
            style={{ width: 'fit-content', margin: 'auto' }}
            onClick={initiateSearch}
          >
            Appliquer
          </Button>
        )} */}
      </Modal>
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

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(CategoryDropdownSearch);
