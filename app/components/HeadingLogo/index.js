/**
 *
 * HeadingLogo
 *
 */

import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
// import Select from 'react-select';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import LogoImg from '../../images/logo/new_logo_2.png';
import { makeSelectLocale } from '../../containers/LanguageProvider/selectors';
import { changeLocale } from '../../containers/LanguageProvider/actions';
import DropdownProfile from '../DropdownProfile';
import makeSelectAuth from '../../containers/Auth/selectors';
import messages from '../messages';
import Button from '../Button';
import { logoutAction, resendEmailVerificationAction } from '../../containers/Auth/actions';
import { BASE_URL } from '../../config/env';
import { readFromStorage, writeToStorage } from '../../utils/storage';
import SearchInput from '../SearchInput';
import history, { replaceWithBackground } from '../../utils/history';
import makeSelectHomePage from '../../containers/HomePage/selectors';
import {
  searchAction,
  setHomePageLayoutStateAction,
  setHomePageFilterAction,
  searchCategoryAction,
} from '../../containers/HomePage/actions';
import { colors } from '../../utils/colors';
import { FlexCenteredColumn, FlexRow } from '../../global-styles';
import noUser from '../../images/no-user.png';
import ProfilePicture from '../ProfilePicture';
import CategoryDropdownSearch from '../CategoryDropdownSearch';
import BurgerImg from '../../images/icons/menu.png';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import { fullName } from '../../utils/formatters';
import makeSelectB2B from '../../containers/B2B/selectors';
import makeSelectLibraries from '../../containers/Libraries/selectors';
import useQuery from '../../hooks/useQuery';

const MOBILE_WIDTH = 920;
const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  //align-items: center;
  //justify-content: center;
  background: linear-gradient(
    180deg,
    ${colors.backgroundBlackBlue} 0%,
    ${colors.backgroundBlackBlue} 90%,
    transparent 100%
  );
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    position: fixed;
    padding-bottom: 20px;
  }
`;

const Warning = styled.div`
  min-height: 60px;
  width: 100%;
  background: ${colors.mainGold};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 15px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const HeadingWrapper = styled.div`
  width: 100%;
  //max-width: 1420px;
  padding: 0 20px;
  margin: auto;
  min-height: 96px;
  display: flex;
  background: #f8f7fb;
  //align-items: center;
  justify-content: space-between;
  text-decoration: none;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    //align-items: center;
    padding: 20px 0;
    //margin: auto;
  }
`;
const Logo = styled.img`
  height: 25px;
  display: block;
  margin-bottom: 20px;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    height: 27px;
    margin-bottom: 10px;
  }
`;
const LeftButtons = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top; 10px;
  margin-bottom: 10px;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    justify-content: center;
  }
`;
const SearchBar = styled.div`
  display: flex;
  justify-content: start;
  position: sticky;
  margin-left: 150px;
  background: #fff;
  width: 50px;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    justify-content: center;
    margin-left: -20px;
  }
`;
const InnerLeft = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    display: none;
    padding: 10px 0;
  }
`;
const InnerLeftMobile = styled.div`
  display: none;
  align-items: center;
  //position: absolute;
  // right: 20px;
  // top: 50%;
  // transform: translateY(-50%);
  //z-index: 1;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
    //position: relative;
    align-items: center;
    justify-content: center;
  }
`;
const LogInButton = styled(Button)`
  font-size: 11px;
  word-break: keep-all;
  //padding: 5px 30px;
  margin-left: 8px;
  width: 90px;
  ${(props) => props.style};
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    width: 105px;
    font-size: 13px;
    padding: 6px;
    margin-left: 5px;
    margin-bottom: 5px;
  }
`;
const MobileButtons = styled.div`
  display: none;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    //margin-top: 10px;
    margin-right: 30px;
    //margin: auto;
  }
`;
const Label = styled.p`
  font-size: 16px;
  color: ${colors.textDark};
  margin: 0 15px 0 25px;
  font-weight: 400;
`;
const Picture = styled(ProfilePicture)`
  width: 31.86px;
  height: 31.86px;
  border-radius: 5px;
`;

const LogosWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  position: relative;
  margin-top: 10px;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    // width: 100%;
    // margin: auto;
    // flex-direction: column;
    display: none;
  }
`;
const Burger = styled.img`
  width: 50px;
  display: none;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
  }
`;
const MenuWrapper = styled.div`
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
    //justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-top: 20px;
    //margin-bottom: 30px;
  }
`;
const ButtonLabel = styled.span`
  line-height: 8px;
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
  margin-left: 20px;
`;

const Link = styled.u`
  margin-left: 5px;
  cursor: pointer;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  //margin-left: 50px;
  // margin-left: 300px;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    // //flex-direction: column;
    margin-left: -50px;
    // margin-right: 40px;
    // margin-bottom: -10px;
  }
`;

const Text = styled.p`
  color: ${colors.mainGreen};
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid ${colors.mainGreen};
  padding-bottom: 20px;
  padding-top: 20px;
`;

const Links = styled.a`
  text-decoration: none;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.lilac};
  text-align: center;
  padding-bottom: 20px;
`;

const LogosWrapperMobile = styled.div`
  display: none;
  @media screen and (max-width: ${MOBILE_WIDTH}px) {
    cursor: pointer;
    display: flex;
    // justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 13px;
    margin-left: 10px;
  }
`;
export const modalStyles = (width) => ({
  overlay: {
    backgroundColor: `${colors.white}E6`,
    zIndex: 9,
  },
  content: {
    // inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    // transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: 'none',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
  },
  headerTitle: {
    fontWeight: 800,
  },
});

function HeadingLogo({
  auth,
  b2B,
  libraries,
  setSearchValue,
  search,
  searchCategory,
  resendEmailVerification,
  setLanguage,
  logout,
}) {
  const { width } = useWindowSize();
  const location = useLocation();
  const query = useQuery();
  const isCoachAffiliation = !!query.get('Ref');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategorySearch, setSelectedCategorySearch] = useState(null);
  const [warningShown, setWarningShown] = useState(true);

  useEffect(() => {
    const searchCategory = readFromStorage('searchCategory');
    if (searchCategory) {
      setSelectedCategorySearch(searchCategory);
      writeToStorage('searchCategory', null);
    }
  }, []);

  useEffect(() => {
    const lang = readFromStorage('@locale');
    !!lang && changeLang(lang);
  }, []);

  useEffect(() => {
    toggleLoggedIn();
  }, [auth.authToken]);

  const closeWarning = () => {
    setWarningShown(false);
  };

  const toggleLoggedIn = () => {
    const { authToken } = auth;
    setLoggedIn(!!authToken);
  };

  const profileRoute = (role) => {
    switch (role) {
      case 'COACH':
        return '/dashboard';
      case 'STUDENT':
        return '/studentProfile/affiliation';
      case 'INSTITUTION_STUDENT':
        return '/studentProfile';
      case 'B2B_ACCOUNT':
        return '/b2b/profile/settings';
      case 'LIBRARY_ACCOUNT':
        return '/libraries/profile/settings';
    }
  };

  const onRegisterButtonClick = () => {
    const forms = document.querySelector('#homepage_form-ref');
    const y = forms?.getBoundingClientRect().top + window.pageYOffset + -100;
    window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const resolveRightSideMenu = () => {
    let userName;
    let userData;

    switch (auth.userInfo?.userRole) {
      case 'COACH':
        userName = fullName(auth.userDataFetched);
        userData = auth.userDataFetched;
        break;
      case 'STUDENT':
      case 'INSTITUTION_STUDENT':
        userName = fullName(auth.studentData);
        userData = auth.studentData;
        break;
      case 'B2B_ACCOUNT':
        userName = b2B.profileData?.accountName;
        userData = b2B.profileData;
        break;
      case 'LIBRARY_ACCOUNT':
        userName = libraries.profileData?.libraryName;
        userData = libraries.profileData;
        break;
    }

    if (isLoggedIn) {
      return (
        <FlexCenteredColumn style={{ marginRight: '10px' }}>
          <FlexRow
            onClick={() => history.push(profileRoute(auth.userInfo?.userRole))}
            style={{ alignItems: 'center', cursor: 'pointer' }}
          >
            {!!userName && <Label>{userName}</Label>}
            <Picture
              src={userData?.photoUrl ? `${BASE_URL}images/${userData?.photoUrl}` : noUser}
            />
          </FlexRow>
        </FlexCenteredColumn>
      );
    }
    return (
      <ButtonsWrapper>
        <LogInButton
          outline
          color={'green'}
          onClick={() => {
            history.replace('/auth/login', {
              background: location,
            });
            console.log(location);
            setModalVisible(false);
          }}
        >
          <ButtonLabel style={{ color: 'black' }}>Connexion</ButtonLabel>
        </LogInButton>
        <LogInButton
          color={colors.lilac}
          onClick={() => {
            history.replace('/subscription/subscriptionChoiceFree', {
              background: location,
            });
            //console.log(location);
            setModalVisible(falses);
          }}
        >
          <ButtonLabel style={{ color: 'white', marginBottom: '1px' }}>Essai Gratuit</ButtonLabel>
        </LogInButton>
        <LogInButton color={colors.mainPink} onClick={() => onRegisterButtonClick()}>
          <ButtonLabel style={{ color: colors.white }}>S'abonner</ButtonLabel>
        </LogInButton>
      </ButtonsWrapper>
    );
  };

  const onSearchChange = (val, type = '') => {
    const encodedVal = encodeURIComponent(val);
    search({ value: encodedVal, type });
    setSearchValue(encodedVal);
    if (val) {
      history.push(`/search?value=${encodeURIComponent(val)}&type=${encodeURIComponent(type)}`);
    }
  };

  const onCategorySearch = (category, searchString) => {
    writeToStorage('searchCategory', category);
    onSearchChange(searchString || category?.name, 'byCat');
  };

  const goToSubscriptionChoice = () => {
    replaceWithBackground({ path: '/subscription/subscriptionChoice', history, location });
  };

  const resendVerificationEmail = () => {
    resendEmailVerification({ email: auth.userInfo?.email });
  };

  const changeLang = (lang) => setLanguage(lang);

  const showWarning = () => {
    const isStudent = auth.userInfo?.userRole === 'STUDENT';
    const emailConfirmed = auth.userDataFetched?.emailConfirmed || auth.studentData.emailConfirmed;
    const demoMode =
      auth.studentData?.trialActive && !auth.studentData?.subscription?.selectedPlanId;
    if (isLoggedIn && isStudent && !emailConfirmed) {
      return (
        <Warning>
          <p>
            ATTENTION ! Merci de consulter le mail que vous venez de recevoir pour confirmer votre
            adresse mail <Link onClick={resendVerificationEmail}>ENVOYER À NOUVEAU L'EMAIL</Link>
          </p>
          <CloseButton onClick={closeWarning}>X</CloseButton>
        </Warning>
      );
    }
    if (isLoggedIn && isStudent && demoMode) {
      return (
        <Warning>
          <p>
            Vous êtes actuellement dans le Mode Découverte, pour obtenir un accès complet à la
            plateforme <Link onClick={goToSubscriptionChoice}>OBTENIR UN ABONNEMENT</Link>
          </p>

          <CloseButton onClick={closeWarning}>X</CloseButton>
        </Warning>
      );
    }
    return null;
  };

  return (
    <Wrapper>
      <MenuWrapper>
        <Burger onClick={() => setModalVisible(true)} src={BurgerImg} />
        <LogosWrapperMobile>
          <Logo onClick={() => history.push('/')} src={LogoImg} alt="Logo" />
        </LogosWrapperMobile>
      </MenuWrapper>
      <HeadingWrapper>
        {/* <InnerLeftMobile> */}

        {/* </InnerLeftMobile> */}
        <MobileButtons>
          {resolveRightSideMenu()}
          {isLoggedIn && (
            <LogInButton
              style={{ margin: 'auto', marginLeft: '10px', width: 'fit-content' }}
              color="green"
              onClick={() => {
                logout();
                setModalVisible(false);
              }}
            >
              <FormattedMessage {...messages.logOut} />
            </LogInButton>
          )}
        </MobileButtons>
        <LogosWrapper>
          <Logo onClick={() => history.push('/')} src={LogoImg} alt="Logo" />
        </LogosWrapper>
        <LeftButtons>
          <SearchBar>
            <SearchInput
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                background: '#fff',
              }}
              onSearch={(val) => onSearchChange(val)}
              //onClear={() => onSearchChange('')}
            />
            <CategoryDropdownSearch
              initCategory={selectedCategorySearch}
              onSelect={onCategorySearch}
            />
          </SearchBar>
          <InnerLeft>{resolveRightSideMenu()}</InnerLeft>
        </LeftButtons>
      </HeadingWrapper>
      {warningShown && showWarning()}
      <Modal
        withHeader
        backButtonHidden
        overlayClassName="transition-position"
        style={modalStyles(width)}
        onClose={() => setModalVisible(false)}
        isOpened={modalVisible}
      >
        <Title>Plus d'informations</Title>
        <Links href="https://www.coachs-online.net/offres-d-abonnements/" target="_blank">
          <Text>Devenir membre</Text>
        </Links>
        <Links href="https://www.coachs-online.net/offre-d-accompagnements/" target="_blank">
          <Text>Devnir Coach</Text>
        </Links>
        <Links href="https://www.evenementmaverick.com" target="_blank">
          <Text>L'évènement Maverick</Text>
        </Links>
      </Modal>
    </Wrapper>
  );
}

HeadingLogo.propTypes = {};

const mapStateToProps = createStructuredSelector({
  locale: makeSelectLocale(),
  auth: makeSelectAuth(),
  b2B: makeSelectB2B(),
  libraries: makeSelectLibraries(),
  homePage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    setLanguage: (lang) => dispatch(changeLocale(lang)),
    logout: () => dispatch(logoutAction()),
    search: (value) => dispatch(searchAction(value)),
    // searchCategory: (value) => dispatch(searchCategoryAction(value)),
    setSearchValue: (value) => dispatch(setHomePageFilterAction(value)),
    setHomePageLayout: (layout) => dispatch(setHomePageLayoutStateAction(layout)),
    resendEmailVerification: (data) => dispatch(resendEmailVerificationAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(HeadingLogo);
