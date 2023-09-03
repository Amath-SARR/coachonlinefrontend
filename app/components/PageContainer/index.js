/**
 *
 * PageContainer
 *
 */

import React, { memo } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import HeadingLogo from '../HeadingLogo';
import OfficeNavigator from '../OfficeNavigator';
import { colors } from '../../utils/colors';
import messages from '../../containers/HomePage/messages';
import facebookIco from '../../images/icons/facebook.svg';
import instagramIco from '../../images/icons/instagram.svg';
import linkedinIco from '../../images/icons/linkedin.svg';
import ScreenLoader from '../ScreenLoader';
import { Link } from 'react-router-dom';
import { ContractsTypes } from '../../store/contracts/contracts.types';


const Wrapper = styled.div`
  background-color: white;
  min-height: 100vh;
  padding-bottom: 35px;
  padding-top: ${(props) => props.navBarShown && '90px'};
  ${(props) => props.style};
  ${(props) => {
    if (props.isDark) {
      return `
        /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.backgroundDarkBlue};
    opacity: 0.4;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${colors.backgroundBlue};
    opacity: 0.4;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.backgroundBlue};
    opacity: 0.4;
  }
      `;
    }
  }}
`;
const InnerWrapper = styled.div`
  // //padding: ${(props) => (props.withPannel ? '0 70px 0 130px' : '0 70px 0 70px')};
  // //margin: 30px 0;
  // z-index: 1;

  // @media screen and (max-width: 1335px) {
  //   padding-left: 100px;
  //   padding-right: 40px;
  // }
  // @media screen and (max-width: 1024px) {
  //   padding-left: ${(props) => (props.withPannel ? '120px' : '60px')};
  //   padding-right: 60px;
  // }
  // @media screen and (max-width: 700px) {
  //   padding-left: ${(props) => (props.withPannel ? '50px' : '5px')};
  //   padding-right: 5px;
  // }
  // ${(props) => props.style};
`;
const WindowContainer = styled.div`
  width: 100%;
  //background-color: white;

  padding: 40px 65px;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.isDark ? colors.borderDark : colors.borderLight)};
  padding-bottom: 85px;
  max-width: 1600px;
  margin: auto;
  @media screen and (max-width: 900px) {
    padding: 20px 10px;
  }
`;
const ChildrenWrapper = styled.div`
  
`;
const Title = styled.p`
  color: ${(props) => (props.isDark ? colors.textDark : colors.black)};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  @media screen and (max-width: 1024px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;
const Footer = styled.div`
  width: 100%;
  min-height: 100px;
  max-width: 1920px;
  margin: auto;
  border-top: 1px solid ${(props) => (props.isDark ? colors.borderDark : colors.borderLight)}50;
  color: ${(props) => (props.isDark ? colors.white : colors.black)};
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  padding-left: ${(props) => (props.withPannel ? '50px' : 'unset')};
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  @media screen and (max-width: 920px) {
    margin: 0px;
  }
`;
const SectionLink = styled(Link)`
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 10px;
  color: ${(props) => (props.isDark ? colors.white : colors.black)};
  @media screen and (max-width: 920px) {
    font-size: 10px;
  }
`;
const ContactLink = styled.a`
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 10px;
  color: ${(props) => (props.isDark ? colors.white : colors.black)};
  @media screen and (max-width: 920px) {
    font-size: 10px;
  }
`;

const SectionTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 15px;
  @media screen and (max-width: 920px) {
    font-size: 12px;
  }
`;
const IconsWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const IconLink = styled.a`
  text-decoration: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 10px;
  @media screen and (max-width: 920px) {
    &:nth-child(1) {
      margin: 0 10px 10px 10px;
    }
  }
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
  filter: ${(props) => (props.isDark ? '' : 'invert()')};
`;
export const PageLoader = styled(ScreenLoader)`
  position: fixed;
  top: 0;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #fff 100%);
`;
function PageContainer({
  title,
  colorScheme,
  children,
  withPanel,
  style = {},
  renderOutsideWindowContainer,
  renderOutsideChildrenWrapper,
  showNavBar = true,
  loaderShown,
}) {
  // const isDarkScheme = colorScheme === 'dark';
  //isDark={isDarkScheme}

  return (
    <Wrapper navBarShown={showNavBar} style={style.wrapper}>
      <div>
        {loaderShown && <PageLoader />}
        {showNavBar && <HeadingLogo />}
        {withPanel && <OfficeNavigator />}
        {renderOutsideWindowContainer}
      </div>
      <InnerWrapper style={style?.innerWrapper} withPannel={withPanel}>
        <WindowContainer>
          {!!title && <Title>{title}</Title>}
          {renderOutsideChildrenWrapper}
          <ChildrenWrapper style={style?.childrenWrapper}>{children}</ChildrenWrapper>
        </WindowContainer>
      </InnerWrapper>
      <Footer withPannel={withPanel}>
        <Section>
          <SectionTitle>
            <FormattedMessage {...messages.contactUs} />
          </SectionTitle>
          <ContactLink href="https://www.coachs-online.com/" target="_blank">
            Agence
          </ContactLink>
          <ContactLink href="mailto:contact@coachs-online.com" target="_blank">
            Vous êtes adhérent
          </ContactLink>
          <ContactLink href="mailto:coachs@coachs-online.com" target="_blank">
            Vous êtes coach
          </ContactLink>
        </Section>
        <Section>
          <SectionTitle>
            <FormattedMessage {...messages.information} />
          </SectionTitle>
          <SectionLink to={`/articles/contracts/${ContractsTypes.PrivacyPolicy}`} target="_blank">
            Politique de confidentialité
          </SectionLink>
          <SectionLink
            to={`/articles/contracts/${ContractsTypes.TermsAndConditions}`}
            target="_blank"
          >
            Termes et conditions.
          </SectionLink>
          <ContactLink
            href="https://www.coachs-online.net/offre-d-accompagnements/"
            target="_blank"
          >
            Devenir Coachs
          </ContactLink>
          {/* <SectionLink to={`/articles/faq`}>FAQ</SectionLink> */}
        </Section>
        <Section>
          <IconsWrapper>
            <IconLink href="https://www.instagram.com/coachsonlineofficiel/" target="_blank">
              <Icon src={instagramIco} />
            </IconLink>
            <IconLink href="https://www.facebook.com/coachsonline" target="_blank">
              <Icon src={facebookIco} />
            </IconLink>
            <IconLink href="https://www.linkedin.com/company/coachs-online" target="_blank">
              <Icon src={linkedinIco} />
            </IconLink>
          </IconsWrapper>
        </Section>
      </Footer>
    </Wrapper>
  );
}

PageContainer.propTypes = {};

export default memo(PageContainer);
