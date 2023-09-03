/**
 *
 * ProfilePicture
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from '../Image';
import FileInput from '../FileInput';
import { colors } from '../../utils/colors';

const NoPictureImg = require('../../images/no-user.png');
const ProfilePictureWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background-position: center center;
  background-color: ${(props) => (props.dark ? colors.backgroundBlue : 'lightgrey')};
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  ${(props) => props.style};
  @media screen and (max-width: 460px) {
    //width: 180px;
    //height: 180px;
  }
`;
const AntiRotateWrapper = styled.div`
  width: 100%;
  height: 100%;
  //transform: rotate(-45deg);
  //position: absolute;
  //width: 130%;
  //height: 130%;
  //top: -15%;
  //left: -15%;
`;
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;
const Picture = styled(Image)`
  width: 100%;
  height: 100%;
  padding: 0 !important;
  object-fit: cover;
`;

function ProfilePicture({
  src,
  onChange,
  style = {},
  pictureStyle = {},
  className = '',
  overlay = null,
  dark = false,
}) {
  const inputRef = useRef();
  const [source, setSource] = useState(src);

  useEffect(() => {
    setSource(src || NoPictureImg);
  }, [src]);

  useEffect(() => {
    inputRef?.current?.addEventListener('change', async function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          onChange && onChange(stripBase64(reader.result));
        };
      }
      setSource(URL.createObjectURL(file));
    });
  }, []);

  const stripBase64 = (string) => string.split('base64,')[1];

  return (
    <ProfilePictureWrapper
      dark={dark}
      style={{ ...style, cursor: onChange ? 'pointer' : 'unset' }}
      className={className}
      onClick={() => onChange && inputRef.current.click()}
    >
      {!!overlay && <Overlay>{overlay}</Overlay>}
      <Picture style={pictureStyle} src={source} />
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/jpg,image/bmp"
      />
    </ProfilePictureWrapper>
  );
}

export default ProfilePicture;
