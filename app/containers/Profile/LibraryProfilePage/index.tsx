/**
 *
 * LibraryProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Redirect, useParams } from 'react-router-dom';
import makeSelectAuth from '../../Auth/selectors';
import { logoutAction } from '../../Auth/actions';
import PageContainer from '../../../components/PageContainer';
import makeSelectDashboard from '../../Dashboard/selectors';
import { colors } from '../../../utils/colors';
import makeSelectSubscription from '../../Subscription/selectors';
import Tabs from '../../../components/Tabs';
import ProfilePicture from '../../../components/ProfilePicture';
import { FlexCenteredColumn, Text, UppercaseText } from '../../../global-styles';
import Button from '../../../components/Button';
import history from '../../../utils/history';
import LibraryAccountSettings from '../../../components/LibraryAccountSettings';
import makeSelectB2B from '../../B2B/selectors';
import makeSelectLibraries from '../../Libraries/selectors';
import {
  GetLibraryStatisticsActionData,
  GetProfileActionData,
  UpdateLibraryActionData,
} from '../../Libraries/actions.types';
import {
  getLibraryStatisticsAction,
  getProfileAction,
  updateProfileAction,
} from '../../Libraries/actions';
import { B2BLibrary } from '../../Libraries/reducer.types';
import { BASE_URL } from '../../../config/env';
import LibraryStatistics from '../../../components/LibraryStatistics';
import { B2BCompanyService } from '../../B2B/reducer.types';
import {
  cancelLibrarySubscriptionAction,
  changeLibraryLinkAction,
  changeLibrarySubscriptionAction,
} from '../../B2B/actions';
import {
  CancelLibrarySubscriptionActionData,
  ChangeLibraryLinkActionData,
  ChangeLibrarySubscriptionActionData,
} from '../../B2B/actions.types';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 270px;
  align-items: center;
  max-width: 330px;
  width: 100%;
  background-color: ${colors.backgroundBlue};
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 20px;
  ${({ style }: { style?: React.CSSProperties }) => style};
`;
export const LongBox = styled(Box)`
  max-width: 1020px;
  height: fit-content;
  margin-bottom: 15px;
  padding: 20px;
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
  { label: 'Statistiques', id: 'statistics' },
];
export function LibraryProfilePage({
  auth,
  b2B,
  libraries,
  updateProfile,
  getProfile,
  selectSubscription,
  changeLink,
  cancelSubscription,
  getStatistics,
  logout,
}) {
  const { tabId, id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [imagePreview, setImagePreview] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');

  useEffect(() => {
    const { photoUrl } = libraries.profileData || {};
    console.log(photoUrl);
    if (photoUrl) {
      setImagePreview(`${BASE_URL}images/${photoUrl}`);
    }
  }, [libraries.profileData?.photoUrl]);

  useEffect(() => {
    console.log('Tab id', tabId);
    tabId && setActiveTab(TABS.findIndex((tab) => tab.id === tabId));
  }, []);

  useEffect(() => {
    getLibrary();
    fetchStatistics();
  }, []);

  const getLibrary = () => getProfile({ body: { token: auth.authToken, id } });

  const fetchStatistics = (startDate?: string, endDate?: string) => {
    const body: GetLibraryStatisticsActionData['body'] = { token: auth.authToken, id };
    if (startDate && endDate) {
      body.end = endDate;
      body.start = startDate;
    }
    getStatistics({ body });
  };

  const onTabChange = (index, tab) => {
    setActiveTab(index);
    history.replace(`${tab.id}`);
  };

  const onSubmit = (data: B2BLibrary) => {
    const dataToSend = data;
    dataToSend.country = data.country?.value || data.country;
    if (photoBase64) {
      dataToSend.photoBase64 = photoBase64;
    }
    console.log(dataToSend);
    updateProfile({ body: { form: { ...dataToSend, token: auth.authToken }, id } });
  };

  const onSubscriptionSelect = (subscription: B2BCompanyService) =>
    selectSubscription({
      body: { subscription, token: auth.authToken, id },
      actions: { onSuccess: getLibrary },
    });
  const onSubscriptionCancel = (subscription: B2BCompanyService) =>
    cancelSubscription({
      body: { subscription, token: auth.authToken, id },
      actions: { onSuccess: getLibrary },
    });
  const onLinkChange = (data: { link: string; libraryId: number }) =>
    changeLink({
      body: { token: auth.authToken, proposedName: data.link, libraryId: data.libraryId },
      actions: { onFinish: getLibrary },
    });

  const onProfileImgUpdate = (base64) => {
    // setImagePreview(base64);
    console.log(base64);
    setPhotoBase64(base64);
  };

  const onLogout = () => {
    logout();
    history.push('/');
  };

  return (
    <div>
      {!!id && !b2B.b2bAuthToken && <Redirect to={'/library/profile/settings'} />}
      {!b2B.b2bAuthToken && !libraries.libraryAuthToken && <Redirect to={'/libraries/log-in'} />}
      <Helmet>
        <title>ProfilePage</title>
        <meta name="description" content="Description of ProfilePage" />
      </Helmet>
      <PageContainer
        colorScheme="dark"
        renderOutsideChildrenWrapper={
          <Header>
            <ProfilePicture src={imagePreview} onChange={onProfileImgUpdate} />
            <UserName>{libraries.profileData?.libraryName}</UserName>
            <UserRole>Bibliotheque</UserRole>
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
          <TabBody>
            <LibraryAccountSettings
              libraryId={id}
              profileData={libraries.profileData}
              onSubmit={onSubmit}
              onSubscriptionSelect={onSubscriptionSelect}
              onSubscriptionCancel={onSubscriptionCancel}
              onChangeLink={onLinkChange}
            />
          </TabBody>
          <TabBody>
            <LibraryStatistics
              statistics={libraries.statistics}
              statisticsRange={libraries.statisticsRange}
              onFetch={fetchStatistics}
            />
          </TabBody>
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
  dashboard: makeSelectDashboard(),
  subscription: makeSelectSubscription(),
  b2B: makeSelectB2B(),
  libraries: makeSelectLibraries(),
});

function mapDispatchToProps(dispatch) {
  return {
    getProfile: (data: GetProfileActionData) => dispatch(getProfileAction(data)),
    getStatistics: (data: GetLibraryStatisticsActionData) =>
      dispatch(getLibraryStatisticsAction(data)),
    updateProfile: (data: UpdateLibraryActionData) => dispatch(updateProfileAction(data)),
    selectSubscription: (data: ChangeLibrarySubscriptionActionData) =>
      dispatch(changeLibrarySubscriptionAction(data)),
    cancelSubscription: (data: CancelLibrarySubscriptionActionData) =>
      dispatch(cancelLibrarySubscriptionAction(data)),
    changeLink: (data: ChangeLibraryLinkActionData) => dispatch(changeLibraryLinkAction(data)),
    logout: () => dispatch(logoutAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LibraryProfilePage);
