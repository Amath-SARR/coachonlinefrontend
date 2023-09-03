/**
 *
 * Modal
 *
 */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import './style.css';
import styled from 'styled-components';
import Image from '../Image';
import { colors } from '../../utils/colors';

const GoBackIcon = require('../../images/icons/go-back.svg');
const CloseIcon = require('../../images/icons/close_blue.png');

export const ModalTitle = styled.p`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  color: ${colors.lilac};
  @media screen and (max-width: 680px) {
    font-size: 22px;
  }
  @media screen and (max-width: 420px) {
    font-size: 18px;
  }
`;

export const ModalSubtitle = styled.p`
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: ${colors.black};
`;

export const ModalInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 100%;
  max-width: 1225px;
  padding: 10px 0 10px 0;
  background-color: ${colors.white};
`;

const Header = styled.div`
  display: flex;
  //align-items: center;
  justify-content: space-between;
  background-color: ${colors.white};
`;
const HeaderTextsWrapper = styled.div`
  margin: ${(props) => (props.scrolled ? '20px 0' : '20px 0')};
  transition: all 0.5s ease-in-out;
  background-color: ${colors.white};
`;
const HeaderButton = styled.div`
  cursor: pointer;
  max-width: 25px;
`;
export const ModalHeaderTitle = styled.h2`
  font-size: 46px;
  // font-size: ${(props) => (props.scrolled ? '20px' : '43px')};
  color: ${colors.black};
  background-color: ${colors.white};
  margin: 0;
  text-align: center;
  transition: font-size 0.5s ease-in-out;
  margin-bottom: 10px;
  @media screen and (max-width: 700px) {
    font-size: 24px;
  }
`;
const InnerWrapper = styled.div`
  overflow: auto;
  margin: auto;
  background-color: ${colors.white};
  @media screen and (max-width: 700px) {
    overflow: auto;
    max-width: 300px;
  }
`;
const NotScrollableArea = styled.div``;

export const ModalHeaderDescription = styled.p`
  font-size: 16px;
  color: ${colors.black};
  font-weight: 300;
  text-align: center;
  margin-bottom: 20px;
`;

const Body = styled.div`
  max-height: 70vh;
  height: 100%;
  overflow: visible;
  // padding: 20px 0;
  background-color: ${colors.white};
  @media screen and (max-width: 700px) {
    max-height: 90vh;
  }
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    background-color: ${colors.white};
  }

  /* Track */
  ::-webkit-scrollbar-track {
    //background: ${colors.backgroundDarkBlue};
    opacity: 0.4;
    background-color: ${colors.white};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    //background: ${colors.backgroundBlue};
    opacity: 0.4;
    background-color: ${colors.white};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    //background: ${colors.backgroundBlue};
    opacity: 0.4;
    background-color: ${colors.white};
  }
`;
function Modal({
  isOpened = false,
  onOpen: onModalOpen = () => null,
  onClose: onModalClose = () => null,
  onBackPress: onModalBackPress = () => null,
  style: styles = {},
  children,
  withHeader,
  headerTitle,
  headerDescription,
  backButtonHidden,
  closeButtonHidden,
  fixedContent,
  ...rest
}) {
  const [opened, setOpened] = useState(false);
  const [bodyScrolled, setBodyScrolled] = useState(false);

  useEffect(() => {
    isOpened !== opened && setOpened(isOpened);
  }, [isOpened]);

  const customStyles = (props) => ({
    overlay: {
      zIndex: 9,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      ...(props?.overlay || {}),
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      inset: '50% auto auto 50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '200px',
      maxWidth: '25vmax',
      // height: '80vh',
      position: 'absolute',
      border: '2px solid #E5137D',
      background: '#fff',
      backgroundColor: 'white',
      overflow: 'hidden',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      //padding: '20px',
      ...(props?.content || {}),
    },
  });

  const onOpen = () => {
    setOpened(true);
    onModalOpen(true);
  };

  const onClose = (event) => {
    event.stopPropagation();
    setOpened(false);
    onModalClose(false);
  };

  const onBackPress = () => {
    onModalBackPress();
  };

  const onBodyScroll = (event) => {
    const { scrollTop } = event.nativeEvent?.target || {};
    scrollTop > 10 && !bodyScrolled && setBodyScrolled(true);
    scrollTop < 10 && bodyScrolled && setBodyScrolled(false);
  };

  const style = customStyles(styles);
  return (
    <ReactModal
      closeTimeoutMS={2000}
      isOpen={opened}
      onRequestClose={onClose}
      style={style}
      {...rest}
    >
      <div className="ResponsiveModal">
        {withHeader && (
          <Header>
            <HeaderButton onClick={onBackPress}>
              {!backButtonHidden && <Image style={{ color: 'black' }} src={GoBackIcon} />}
            </HeaderButton>
            <HeaderTextsWrapper scrolled={bodyScrolled} style={styles?.headerTextsWrapper}>
              {!!headerTitle && (
                <ModalHeaderTitle scrolled={bodyScrolled} style={styles?.headerTitle}>
                  {headerTitle}
                </ModalHeaderTitle>
              )}
              {!!headerDescription && (
                <ModalHeaderDescription style={styles?.headerDescription}>
                  {headerDescription}
                </ModalHeaderDescription>
              )}
            </HeaderTextsWrapper>

            <HeaderButton onClick={onClose}>
              {!closeButtonHidden && <Image width="20px" src={CloseIcon} />}
            </HeaderButton>
          </Header>
        )}
        <InnerWrapper>
          {!!fixedContent && <NotScrollableArea>{fixedContent}</NotScrollableArea>}
          <Body
            onScroll={onBodyScroll}
            style={{ backgroundColor: 'white' }} //styles.modalBody
            onClick={(ev) => ev.stopPropagation()}
          >
            {children}
          </Body>
        </InnerWrapper>
      </div>
    </ReactModal>
  );
}

export default Modal;
