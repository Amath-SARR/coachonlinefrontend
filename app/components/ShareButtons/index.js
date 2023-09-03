/**
 *
 * ShareButtons
 *
 */

import React, { useRef } from 'react';
import styled from 'styled-components';
import { FacebookShareButton, LinkedinShareButton } from 'react-share';

import instagramIco from '../../images/icons/instagram.svg';
import facebookIco from '../../images/icons/facebook.svg';
import linkedinIco from '../../images/icons/linkedin.svg';

const IconsWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 520px) {
    flex-direction: column;
  }
`;
const IconLink = styled.div`
  text-decoration: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 10px;
  @media screen and (max-width: 520px) {
    &:nth-child(1) {
      margin: 0 10px 10px 10px;
    }
  }
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;

function ShareButtons({ buttons = ['facebook', 'linkedin'], url }) {
  const fbRef = useRef();
  const linkRef = useRef();

  const renderButtons = () =>
    buttons.map(button => {
      switch (button) {
        case 'facebook':
          return (
            <div key={button}>
              <FacebookShareButton
                ref={fbRef}
                style={{ visibility: 'hidden' }}
                url={url}
              />
              <IconLink onClick={() => fbRef?.current?.click()}>
                <Icon src={facebookIco} />
              </IconLink>
            </div>
          );
        case 'linkedin':
          return (
            <div key={button}>
              <LinkedinShareButton
                ref={linkRef}
                style={{ visibility: 'hidden' }}
                url={url}
              />
              <IconLink onClick={() => linkRef?.current?.click()}>
                <Icon src={linkedinIco} />
              </IconLink>
            </div>
          );
      }
    });
  return (
    <IconsWrapper>
      {/* <IconLink */}
      {/*  href="https://www.instagram.com/coachsonlineofficiel/" */}
      {/*  target="_blank" */}
      {/* > */}
      {/*  <Icon src={instagramIco} /> */}
      {/* </IconLink> */}
      {renderButtons()}
    </IconsWrapper>
  );
}

export default ShareButtons;
