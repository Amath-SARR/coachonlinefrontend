/**
 *
 * OfficeNavigator
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ArrowUp from '../../images/icons/arrow-up.svg';
import DashboardIcon from '../../images/icons/dashboard.svg';
import CameraIcon from '../../images/icons/camera.svg';
import CashIcon from '../../images/icons/cash.svg';
import StatsIcon from '../../images/icons/stats.svg';
import PersonIcon from '../../images/icons/person.svg';
import LogoutIcon from '../../images/icons/logout.svg';
import makeSelectAuth from '../../containers/Auth/selectors';
import { getUserBasicDataAction, logoutAction } from '../../containers/Auth/actions';
import messages from '../messages';
import history from '../../utils/history';
import { fullName } from '../../utils/formatters';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  height: 100%;
  width: 260px;
  background-color: white;
  padding: 110px 20px 20px 20px;
  z-index: 2;
  transition: all 0.3s ease;
  overflow: hidden;
  @media screen and (max-width: 700px) {
    padding: 110px 15px 20px 15px;
    width: 245px;
  }
`;
const IconLink = styled(Link)`
  width: 100%;
  display: flex;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 18px;
  padding: 20px 0;
`;
const IconWrapper = styled.div`
  width: 25px;
  height: 25px;
  @media screen and (max-width: 700px) {
    width: 18px;
    height: 18px;
  }
`;
const Icon = styled.img`
  width: 100%;
  height: 100%;
`;
const MenuTitle = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 18px;
  padding: 20px 0;
  cursor: pointer;
`;

const pinkIconStyle =
  'invert(19%) sepia(82%) saturate(4862%) hue-rotate(318deg) brightness(91%) contrast(97%)';

function OfficeNavigator({ getUserData, auth, logout }) {
  const ICON_LINKS = [
    {
      to: '/dashboard',
      message: messages.dashboard,
      dataTip: 'Tableau de bord',
      icon: DashboardIcon,
    },
    // {
    //   to: '/live-events',
    //   message: messages.dashboard,
    //   dataTip: 'Événement en direct',
    //   icon: LiveIcon,
    // },
    {
      to: '/billing',
      message: messages.billing,
      dataTip: 'Facturation',
      icon: CashIcon,
    },
    {
      to: '/ranking',
      message: messages.ranking,
      dataTip: 'Classement',
      icon: StatsIcon,
    },
    {
      to: '/profile/affiliation',
      message: messages.profile,
      dataTip: 'Profil',
      icon: PersonIcon,
    },
    {
      to: '/',
      message: messages.profile,
      dataTip: 'Déconnexion',
      icon: LogoutIcon,
      action: logout,
    },
  ];

  const [menuHidden, setMenuHidden] = useState(true);
  const [currentPath] = useState(history.location.pathname);

  useEffect(() => {
    getUserData();
  }, []);

  const renderIconLinks = () =>
    ICON_LINKS.map((item, index) => (
      <IconLink key={item.to} to={item.to} data-tip={item.dataTip} data-for="officeNavigator">
        <p>
          <FormattedMessage {...item.message} />
        </p>
        <IconWrapper onClick={item.action}>
          <Icon
            src={item.icon}
            alt="arrowIcon"
            style={{ filter: currentPath === item.to ? pinkIconStyle : 'none' }}
          />
        </IconWrapper>
      </IconLink>
    ));

  return (
    <Wrapper style={{ left: menuHidden ? -200 : 0 }}>
      <div style={{ width: '100%' }}>
        <MenuTitle onClick={() => setMenuHidden(!menuHidden)}>
          <div style={{ textAlign: 'left', marginRight: '10px' }}>
            <p style={{ fontSize: 25 }}>{fullName(auth.userDataFetched)}</p>
            <p style={{ fontSize: 10, fontWeight: '400' }}>{auth.userDataFetched.city}</p>
          </div>
          <IconWrapper>
            <Icon
              src={ArrowUp}
              alt="arrowIcon"
              style={{
                transform: menuHidden ? 'rotate(90deg)' : 'rotate(270deg)',
              }}
            />
          </IconWrapper>
        </MenuTitle>
        <div style={{ marginTop: 20 }}>{renderIconLinks()}</div>
      </div>
      <ReactTooltip id="officeNavigator" effect="solid" place="right" />
    </Wrapper>
  );
}

OfficeNavigator.propTypes = {};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    getUserData: () => dispatch(getUserBasicDataAction()),
    logout: () => dispatch(logoutAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(OfficeNavigator);
