/**
 *
 * B2BProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { Redirect, useParams } from 'react-router-dom';
import history from '../../../utils/history';
import { colors } from '../../../utils/colors';
import { FlexCenteredColumn, Text, UppercaseText } from '../../../global-styles';
import styled from 'styled-components';
import Button from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
import ProfilePicture from '../../../components/ProfilePicture';
import Tabs from '../../../components/Tabs';
import CompanyDataForm from '../../../components/CompanyDataForm';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../B2B/selectors';
import makeSelectB2B from '../../B2B/selectors';
import SalesPersons from '../../../components/SalesPersons';
import Libraries from '../../../components/Libraries';
import { logoutAction } from '../../Auth/actions';
import { B2BAccountData } from '../../B2B/reducer.types';
import { getProfileAction, updateProfileAction } from '../../B2B/actions';
import { GetProfileActionData, UpdateB2BActionData } from '../../B2B/actions.types';
import { BASE_URL } from '../../../config/env';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 240px;
  align-items: center;
  max-width: 330px;
  width: 100%;
  background-color: ${colors.backgroundBlue};
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 20px;
  ${({ style }: { style?: React.CSSProperties }) => style};
`;
export const LongBox = styled(Box)`
  max-width: 1020px;
  height: fit-content;
  margin-bottom: 15px;
`;
const Header = styled(FlexCenteredColumn)`
  position: relative;
`;
const TabBody = styled.div`
  width: 100%;
  padding: 30px 25px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media screen and (max-width: 1024px) {
    padding: 30px 10px;
    flex-direction: column;
  }
`;
const DeleteAccountButtonWrapper = styled.div`
  position: absolute;
  right: 0;
`;
const UserName = styled(Text)`
  font-size: 28px !important;
  font-weight: bolder;
  margin: 8px 0;
  text-align: center;
`;
const UserRole = styled(UppercaseText)`
  margin: 0 0 15px 0;
`;
const LogoutButton = styled(Button)`
  width: fit-content;
  margin: 10px auto;
  padding: 10px 30px;
`;

const TABS = [
  { label: 'Paramètres du compte', id: 'settings' },
  { label: 'Référents', id: 'referents' },
  { label: 'Accès Entreprise', id: 'libraries' },
  // { label: 'Statistiques', id: 'statistics' },
  // { label: 'Affiliation', id: 'affiliation', },
];

export function B2BProfilePage({ auth, b2B, updateProfile, getProfile, updateAvatar, logout }) {
  const { tabId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [imagePreview, setImagePreview] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');

  useEffect(() => {
    console.log('Tab id', tabId);
    tabId && setActiveTab(TABS.findIndex((tab) => tab.id === tabId));
  }, []);

  useEffect(() => {
    getProfile({ body: { token: b2B.b2bAuthToken } });
  }, []);

  useEffect(() => {
    const { photoUrl } = b2B.profileData || {};
    console.log(photoUrl);
    if (photoUrl) {
      setImagePreview(`${BASE_URL}images/${photoUrl}`);
    }
  }, [b2B.profileData?.photoUrl]);

  const onProfileImgUpdate = (base64) => {
    // setImagePreview(base64);
    console.log(base64);
    setPhotoBase64(base64);
  };

  const onTabChange = (index, tab) => {
    setActiveTab(index);
    history.replace(`/b2b/profile/${tab.id}`);
  };

  const onCompanyDataSubmit = (data: B2BAccountData) => {
    const dataToSend = data;
    dataToSend.country = data.country?.value || data.country;
    if (photoBase64) {
      dataToSend.photoBase64 = photoBase64;
    }
    console.log(dataToSend);
    updateProfile({ body: { form: dataToSend, token: b2B.b2bAuthToken } });
  };

  const onLogout = () => {
    logout();
    history.push('/');
  };

  return (
    <div>
      {!b2B.b2bAuthToken && <Redirect to={'/auth/login'} />}
      <PageContainer
        colorScheme="dark"
        renderOutsideChildrenWrapper={
          <Header>
            <ProfilePicture src={imagePreview} onChange={onProfileImgUpdate} />
            <UserName>{b2B.profileData?.accountName}</UserName>
            <UserRole>B2B</UserRole>
            {/*<DeleteAccountButtonWrapper>*/}
            {/*  <DeleteAccountButton />*/}
            {/*</DeleteAccountButtonWrapper>*/}
          </Header>
        }
        style={{
          wrapper: { backgroundColor: colors.backgroundBlackBlue },
          windowContainer: {
            maxWidth: '1460px',
            backgroundColor: 'unset',
            background: 'linear-gradient(110deg, #1B2134 0%, #121621 100%)',
            border: 'none',
          },
        }}
      >
        <Tabs
          hideNextButton
          useColorOverlays={false}
          onTabChange={onTabChange}
          activeIndex={activeTab}
          styles={{
            tabStyle: {
              borderBottom: 'none',
            },
            activeTabStyle: {
              borderBottom: `1px solid ${colors.mainGreen}`,
              padding: '5px',
            },
          }}
          tabs={TABS}
        >
          <TabBody style={{ maxWidth: 400 }}>
            <CompanyDataForm company={b2B.profileData} onSubmit={onCompanyDataSubmit} />
          </TabBody>
          <TabBody style={{ maxWidth: 900 }}>
            <SalesPersons
              salesPersons={b2B.profileData?.accountSalesPersons || []}
              company={b2B.profileData}
              // createPerson={createPerson}
              // updatePerson={updatePerson}
              // deletePerson={deletePerson}
              // onFinish={fetchCompanyData}
            />
          </TabBody>
          <TabBody>
            <Libraries />
          </TabBody>
          {/*<TabBody></TabBody>*/}
        </Tabs>
        <LogoutButton onClick={onLogout} color="grey" outline>
          Déconnexion
        </LogoutButton>
      </PageContainer>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  b2B: makeSelectB2B(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getProfile: (data: GetProfileActionData) => dispatch(getProfileAction(data)),
    updateProfile: (data: UpdateB2BActionData) => dispatch(updateProfileAction(data)),
    logout: () => dispatch(logoutAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(B2BProfilePage);
