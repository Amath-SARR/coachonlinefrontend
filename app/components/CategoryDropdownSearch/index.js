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
//import { Category } from '../CategorySelector';
import { getCategoriesAction } from '../../containers/Dashboard/actions';
import { FlexRow } from '../../global-styles';
import Button from '../Button';
const ChevronDown = require('../../images/icons/chevron-down--white.png');
const ChevronLeftIcon = require('../../images/icons/arrowLeft.svg');

// import makeSelectAuth from '../../containers/Auth/selectors';
import { Category } from './../CategorySelector/index';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${colors.lilac};
  // border-right: none;
  border-radius: 0px 8px 8px 0px;
  // border-bottom-left-radius: 8px;
  min-width: 100px;
  padding: 0 10px;
  background: #e21680;
  height: 30px;
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

const Text = styled.p`
  color: #fff;
  font-size: 0.8em;
  word-break: keep-all;
  font-weight: 600;
  margin: 2px 3px;
  cursor: 'pointer';
`;
const Categories = styled(FlexRow)`
  flex-wrap: wrap;
  width: 100%;
  margin-left: 200px;
`;
const CategoryItem = styled(Category)`
  font-size: 20px;
  font-weight: 300;
  margin: 0 10px 10px 0;
  color: ${(props) => (props.isSelected ? 'white' : `${'#191919'}`)};
  background: ${(props) =>
    props.isSelected
      ? `linear-gradient(90deg, ${colors.lilac} 30%, ${colors.mainPink} 100%)`
      : 'transparent'};
`;

const Title = styled.div`
  width: 1442px;
  font-size: 30px;
  font-weight: 100;
  text-transform: uppercase;
  margin-bottom: 20px;
  margin-block-end: 6px;
  margin-top: 10px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;

const SubTitle = styled.div`
  width: 1442px;
  color: var(--rose, #e21680); //#000;
  /* Coachs - Sous-titre */
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-block-end: 20px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;

const WrapperButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  margin-left: 200px;
  margin-top: 50px;
`;

const ComeBack = styled.span`
  color: #000;
  /* Texte général */
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    //background: 'white',
    border: `1px solid ${colors.lilac}`,
    //borderRadius: 24,
    display: 'flex',
    width: 1400,
    padding: '28px 66px 60px 66px',
    flexDirection: 'column',
    alignItems: 'flexEnd',
    gap: 8,
    backgroundColor: '#F4F4F6',
    maxWidth: '85%',
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

  const toggleModal = (visible) => {
    setModalVisible(visible);
  };

  const hasChildren = !!category?.children?.length;

  return (
    <Wrapper onClick={() => toggleModal(true)}>
      {/* <IconWrapper>
        <Icon src={CategoriesIcon} />
      </IconWrapper> */}
      <Text>{category?.name || <FormattedMessage {...messages.categories} />}</Text>
      <Chevron
        src={ChevronDown}
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
        onBackPress={() => null}
        isOpened={modalVisible}
      //headerTitle={<FormattedMessage {...messages.categories} />}
      >
        <Categories
          style={hasChildren ? { borderBottom: '1px solid white', marginBottom: 10 } : {}}
        >
          <Title>catégories</Title>
          <SubTitle>
            Etape 1 : pour commencer, sélectionnez la catégorie de votre choix
          </SubTitle>
          {dashboard?.categories?.map((cat) => (
            <CategoryItem
              key={cat.id}
              isSelected={cat.id === category?.id}
              onClick={() => onSelect(cat)}
            >
              {cat.name}
            </CategoryItem>
          ))}
        </Categories>

        {!!category && (
          <>
            <Categories>
              <Title>sous-catégories</Title>
              <SubTitle>
                Etape 2: Maintenant sélectionnez la sous-catégorie pour affiner votre recherche,
                sinon cliquez sur “Appliquer”
              </SubTitle>
            </Categories>
            <Categories>
              {category?.children?.map((cat) => (
                <CategoryItem
                  key={cat.id}
                  isSelected={
                    childCategories?.findIndex((category) => category.id === cat.id) >= 0
                  }
                  onClick={() => toggleChildCategory(cat)}
                >
                  {cat.name}
                </CategoryItem>
              ))}
            </Categories>
            <WrapperButton>
              <Button
                color="pink"
                style={{ width: 'fit-content', float: 'right' }}
                onClick={initiateSearch}
              >
                Appliquer
              </Button>
            </WrapperButton>
          </>
        )}
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
