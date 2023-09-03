/**
 *
 * RegisterPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import makeSelectAuth from '../selectors';
import messages from '../../../components/messages';
import { colors } from '../../../utils/colors';
import history from '../../../utils/history';
import { authModalStyles, InnerWrapper } from '../index';
import Modal, { ModalHeaderDescription, ModalHeaderTitle } from '../../../components/Modal';
import { BASE_URL } from '../../../config/env';
import makeSelectLibraries from '../../Libraries/selectors';
import { getInstitutionAction, getProfessionsAction } from '../../Libraries/actions';
import Image from '../../../components/Image';
import RegisterForm from '../../../components/RegisterForm/register-form';
import useWindowSize from '../../../hooks/useWindowSize';

const AffiliateHostWrapper = styled.div`
  margin-bottom: 20px;
`;
const Text = styled.p`
  color: ${({ color }) => color || colors.lilac};
  margin-bottom: 10px;
`;
const Link = styled.a`
  color: ${({ color }) => color || colors.lilac};
`;

export function LibraryRegisterPage({ libraries, getProfessions, getInstitutionInfo }) {
  const { width } = useWindowSize();
  const { accountType, libraryName } = useParams();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (libraryName) {
      getProfessions();
      getInstitutionInfo({ body: { id: libraryName } });
    }
  }, [libraryName]);

  useEffect(() => {
    console.log('Opened');
    setOpened(true);
  }, []);

  const closeModal = () => {
    setOpened(false);
    setTimeout(() => history.replace(location?.state?.background?.pathname || '/'), 200);
  };

  const modalStyle = authModalStyles(width);

  const renderReferenceInfo = () => {
    if (!!libraryName) {
      return (
        <AffiliateHostWrapper style={{ textAlign: 'center' }}>
          <Image
            style={{
              width: '100px',
              height: 'auto',
              marginBottom: '20px',
              border: '1px solid #3b3b8e',
              borderRadius: '10px',
              padding: '10px'
            }}
            src={`${BASE_URL}images/${libraries.institutionData?.photoUrl}`}
          />
          <Text>Vous vous inscrivez par le lien de référence de la bibliothèque:</Text>
          <Text color={colors.mainGreen}>{libraries.institutionData?.libraryName}</Text>
          <Text>
            <Link color={colors.mainGreen} href={`mailto:${libraries.institutionData?.email}`}>
              {libraries.institutionData?.email}
            </Link>
          </Text>
          <Text>
            <Link color={colors.mainGreen} href={`https://${libraries.institutionData?.website}`}>
              {libraries.institutionData?.website}
            </Link>
          </Text>
        </AffiliateHostWrapper>
      );
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpened={opened}
      style={modalStyle}
      onClose={closeModal}
      overlayClassName="transition"
      withHeader
      backButtonHidden
      headerTitle={<FormattedMessage {...messages.registrationTitle} />}
      headerDescription={<FormattedMessage {...messages.registerNewAccount} />}
    >
      <InnerWrapper>
        {renderReferenceInfo()}
        <RegisterForm
          libraryState={!!libraryName}
          submitLabel={"S'abonner"}
          accountType={accountType}
        />
      </InnerWrapper>
    </Modal>
  );
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  libraries: makeSelectLibraries(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProfessions: () => dispatch(getProfessionsAction()),
    getInstitutionInfo: (data) => dispatch(getInstitutionAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LibraryRegisterPage);
