/**
 *
 * SharebaleLink
 *
 */

import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { colors } from '../../utils/colors';
import CopyImg from '../../images/icons/copy.svg';
import { ShareableLinkProps } from './index.props';
import Input from '../Input';
import Label from '../Label';

const Wrapper = styled.div``;
const Link = styled(Input)`
  margin: 0;
`;
const LinkWrapper = styled.div`
  background-color: ${colors.primaryBackgroundLight};
  width: 100%;
  border-radius: 10px;
  display: flex;
  padding: 5px 10px;
  align-items: center;
`;
const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 4px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
  filter: ${({ dark }) => (dark ? '' : 'invert(1)')};
`;

function ShareableLink(props: ShareableLinkProps) {
  const { link, label, dark = true, wrapperStyle, accent = colors.mainGreen } = props;
  const copyToClipboard = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Copié dans le presse-papiers', { autoClose: 2000 });
    } else {
      toast.error(
        "Veuillez d'abord indiquer vos nom et prénom dans la section Informations sur le profil.",
        { autoClose: 4000 },
      );
    }
  };
  return (
    <Wrapper style={wrapperStyle}>
      <Label label={label} />
      <LinkWrapper>
        <Link
          redesigned={dark}
          style={{
            margin: 0,
            backgroundColor: colors.primaryBackgroundLight,
            marginBottom: 0,
            width: '100%',
            flex: 1,
          }}
          inputProps={{
            value: link,
            readOnly: true,
            style: {
              backgroundColor: colors.primaryBackgroundLight,
              color: accent,
              padding: '5px',
              fontSize: 20,
            },
          }}
        />
        <IconWrapper style={{ cursor: 'pointer' }} onClick={copyToClipboard}>
          <Icon src={CopyImg} />
        </IconWrapper>
      </LinkWrapper>
    </Wrapper>
  );
}

export default ShareableLink;
