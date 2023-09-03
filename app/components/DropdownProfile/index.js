/**
 *
 * DropdownProfile
 *
 */

import React, { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import messages from './messages';
import { colors } from '../../utils/colors';
import useOuterClick from '../../hooks/useOuterClick';
import chevronDown from '../../images/icons/chevron-down--white.png';
import noUser from '../../images/no-user.png';
import Image from '../Image';
import ProfilePicture from '../ProfilePicture';

const Wrapper = styled.div`
  position: relative;
  height: 50px;
  display: flex;
`;
const Dropdown = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const Label = styled.p`
  font-size: 14px;
  color: ${colors.textDark};
  margin-right: 15px;
`;
const Chevron = styled(Image)`
  width: 15px;
  height: 15px;
  margin-left: 10px;
`;
const Picture = styled(ProfilePicture)`
  width: 31.86px;
  height: 31.86px;
  border-radius: 5px;
`;
const DropdownOptions = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 55px;
  right: 0;
  width: 150px;
  min-height: 30px;
  background-color: ${colors.secondaryBackgroundDark};
  border: 1px solid ${colors.borderDark};
  border-radius: 5px;
  overflow: hidden;
`;
const Option = styled.div`
  text-decoration: none;
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: 1px solid ${colors.borderDark}20;
  font-size: 14px;

  :hover {
    background-color: ${colors.primaryBackgroundDark}90;
    font-weight: bold;
  }
`;

export default function DropdownProfile({ label, img, isCoach, logout }) {
  const [areOptionsVisible, setOptionsVisible] = useState(false);

  const innerDropdownOptionsRef = useOuterClick(
    () => areOptionsVisible && setOptionsVisible(false),
  );

  const OPTIONS = [
    {
      label: messages.goToProfile,
      link: '/profile',
      onClick: () => null,
      role: 'coach',
    },
    {
      label: messages.goToDashboard,
      link: '/dashboard',
      onClick: () => null,
      role: 'coach',
    },
    {
      label: messages.goToProfile,
      link: '/studentProfile',
      onClick: () => null,
      role: 'student',
    },
    {
      label: messages.logout,
      link: '/',
      onClick: () => logout(),
    },
  ];

  return (
    <Wrapper>
      <Dropdown onClick={() => setOptionsVisible(true)}>
        {!!label && <Label>{label}</Label>}
        <Picture src={img || noUser} />
        <Chevron
          style={{
            transform: areOptionsVisible ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          src={chevronDown}
        />
      </Dropdown>
      <DropdownOptions
        ref={innerDropdownOptionsRef}
        style={{ display: areOptionsVisible ? 'flex' : 'none' }}
      >
        {OPTIONS.map((option, i) => {
          if (isCoach) {
            return (
              (option.role === 'coach' || !option.role) && (
                <Option
                  as={option.link ? Link : Option}
                  to={option.link}
                  onClick={option.onClick}
                  key={i}
                >
                  <FormattedMessage {...option.label} />
                </Option>
              )
            );
          }
          return (
            (option.role === 'student' || !option.role) && (
              <Option
                as={option.link ? Link : Option}
                to={option.link}
                onClick={option.onClick}
                key={i}
              >
                <FormattedMessage {...option.label} />
              </Option>
            )
          );
        })}
      </DropdownOptions>
    </Wrapper>
  );
}

DropdownProfile.propTypes = {};
