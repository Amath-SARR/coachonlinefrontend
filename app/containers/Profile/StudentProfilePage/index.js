/**
 *
 * ProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../../components/Input';
import InputSubmit from '../../../components/InputSubmit';
import makeSelectAuth from '../../Auth/selectors';
import {
  attachUserCategoryAction,
  detachUserCategoryAction,
  getUserBasicDataAction,
  getUserCategoriesAction,
  logoutAction,
  updateAvatarAction,
  updatePasswordAction,
  updateUserDataAction,
} from '../../Auth/actions';
import { BASE_URL } from '../../../config/env';
import messages from '../../../components/messages';
import PageContainer from '../../../components/PageContainer';
import makeSelectDashboard from '../../Dashboard/selectors';
import { colors } from '../../../utils/colors';
import {
  cancelSubscriptionAction,
  getActiveSubscriptionAction,
  getCardInfoAction,
  getCurrentSubscriptionAction,
  getPaymentMethodsAction,
} from '../../Subscription/actions';
import makeSelectSubscription from '../../Subscription/selectors';
import SubscriptionInfo from '../../../components/SubscriptionInfo';
import ProfilePaymentDetails from '../../../components/ProfilePaymentDetails';
import SelectInput from '../../../components/SelectInput';
import Tabs from '../../../components/Tabs';
import CredentialsForm from '../../../components/CredentialsForms';
import { countries } from '../../../utils/countries';
import ProfilePicture from '../../../components/ProfilePicture';
import { FlexCenteredColumn, Text, UppercaseText } from '../../../global-styles';
import DeleteAccountButton from '../../../components/DeleteAccountButton';
import Button from '../../../components/Button';
import ListOfStudentInvoices from '../../../components/ListOfStudentInvoices';
import { fullName } from '../../../utils/formatters';
import AffiliationInfo from '../../../components/AffiliationInfo';
import { yupValidators } from '../../../utils/validate';

const Header = styled(FlexCenteredColumn)`
  position: relative;
`;
const Column = styled.div`
  flex: 1;
  padding: 10px 15px;
  max-width: 394px;
  @media screen and (max-width: 1024px) {
    padding: 10px 0;
  }
`;
const TabBody = styled.div`
  //width: 100%;
  padding: 30px 25px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  @media screen and (max-width: 1024px) {
    padding: 30px 10px;
    flex-direction: column;
    max-width: 100%;
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

const registerSchema = yup.object().shape({
  phoneNo: yupValidators.phoneNo,
});

const TABS = (userRole) => {
  const tabs = [{ label: 'Paramètres du compte', id: 'profile-settings' }];
  console.log('user role', userRole);
  if (userRole === 'STUDENT') {
    tabs.push({ label: 'Factures', id: 'invoices' });
    tabs.push({ label: 'Parrainage', id: 'affiliation' });
  }
  return tabs;
};
export function StudentProfilePage({
  history,
  getUserData,
  updateUserData,
  auth,
  updateAvatar,
  cancelSubscription,
  subscription,
  getActiveSubscription,
  getCurrentSubscription,
  getCardInfo,
  getPaymentMethods,
  logout,
}) {
  const { tabId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = (data) => updateUserData(data);

  useEffect(() => {
    console.log('Tab id', tabId);
    tabId && setActiveTab(TABS(auth.userInfo?.userRole).findIndex((tab) => tab.id === tabId));
  }, []);

  useEffect(() => {
    getUserData();
    getCardInfo();
    getActiveSubscription();
    getCurrentSubscription();
    getPaymentMethods();
  }, []);

  const onProfileImgUpdate = (base64) => {
    updateAvatar({ data: base64, remove: false });
  };

  const onTabChange = (index, tab) => {
    setActiveTab(index);
    history.replace(`/studentProfile/${tab.id}`);
  };

  const onLogout = () => {
    logout();
    history.push('/');
  };

  const userCountry = countries?.filter(
    (country) => country.value === auth.studentData?.country,
  )?.[0];

  const onSubscriptionCancel = (data) => {
    cancelSubscription({ body: { answerId: data.answerId } });
  };

  return (
    <div>
      <Helmet>
        <title>ProfilePage</title>
        <meta name="description" content="Description of ProfilePage" />
      </Helmet>
      <PageContainer
        colorScheme="dark"
        renderOutsideChildrenWrapper={
          <Header>
            <ProfilePicture
              src={auth.studentData?.photoUrl && `${BASE_URL}images/${auth.studentData?.photoUrl}`}
              onChange={onProfileImgUpdate}
            />
            <UserName>{fullName(auth.studentData)}</UserName>
            <UserRole>ABONNE COMPTE</UserRole>
            <DeleteAccountButtonWrapper>
              <DeleteAccountButton />
            </DeleteAccountButtonWrapper>
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
        history={history}
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
          tabs={TABS(auth.userInfo?.userRole)}
        >
          <TabBody>
            {auth.userInfo?.userRole === 'STUDENT' && (
              <Column>
                <SubscriptionInfo
                  subscription={subscription}
                  cancelSubscription={onSubscriptionCancel}
                  userRole={auth.userInfo?.userRole}
                  auth={auth}
                />
                <ProfilePaymentDetails history={history} />
              </Column>
            )}

            <Column>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'firstName',
                    defaultValue: auth.studentData.firstName,
                  }}
                  labelName={messages.firstName}
                  error={errors.name?.firstName}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'lastName',
                    defaultValue: auth.studentData.lastName,
                  }}
                  labelName={messages.Surname}
                  error={errors.name?.lastName}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'birthDate',
                    defaultValue: auth.studentData.yearOfBirth,
                  }}
                  labelName={messages.birthDate}
                  error={errors.name?.birthDate}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'phoneNo',
                    defaultValue: auth.studentData.phoneNo,
                    type: 'tel',
                  }}
                  labelName={messages.phoneNo}
                  error={errors?.phoneNo?.message}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'address',
                    defaultValue: auth.studentData.address,
                  }}
                  labelName={messages.address}
                  error={errors?.address?.message}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'postalCode',
                    defaultValue: auth.studentData.postalCode,
                  }}
                  labelName={messages.postalCode}
                  error={errors?.postalCode?.message}
                />
                <Input
                  redesigned
                  colorScheme="dark"
                  inputProps={{
                    ref: register,
                    name: 'city',
                    defaultValue: auth.studentData.city,
                  }}
                  labelName={messages.City}
                  error={errors.name?.city}
                />
                <Controller
                  redesigned
                  colorScheme="dark"
                  name="country"
                  error={errors?.country?.message}
                  control={control}
                  options={countries}
                  labelName={messages.country}
                  defaultValue2={userCountry}
                  defaultValue={userCountry}
                  placeholderProp="--Sélectionnez votre pays--"
                  as={SelectInput}
                />
                <Controller
                  redesigned
                  name="gender"
                  colorScheme="dark"
                  control={control}
                  options={[
                    { value: 'Male', label: 'Homme' },
                    { value: 'Female', label: 'Femme' },
                  ]}
                  labelName={messages.Gender}
                  defaultValue2={{
                    value: auth.studentData?.gender,
                    label: auth.studentData?.gender && (
                      <FormattedMessage {...messages[auth.studentData?.gender]} />
                    ),
                  }}
                  as={SelectInput}
                />
                <InputSubmit
                  outline
                  showLoader
                  value="Sauvegarder"
                  style={{ marginBottom: '10px', flex: 1 }}
                  inputStyle={{ width: '100%' }}
                />
              </form>
            </Column>
            <Column>
              <CredentialsForm colorScheme="dark" />
            </Column>
          </TabBody>
          {auth.userInfo?.userRole === 'STUDENT' && (
            <TabBody>
              <ListOfStudentInvoices />
            </TabBody>
          )}
          {auth.userInfo?.userRole === 'STUDENT' && (
            <TabBody>
              <AffiliationInfo withPayPal dark accent={colors.mainGreen} />
            </TabBody>
          )}
        </Tabs>
        <LogoutButton onClick={onLogout} color="green" outline>
          Déconnexion
        </LogoutButton>
      </PageContainer>
    </div>
  );
}

StudentProfilePage.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  dashboard: makeSelectDashboard(),
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    getUserData: () => dispatch(getUserBasicDataAction()),
    updateUserData: (data) => dispatch(updateUserDataAction(data)),
    updatePassword: (data) => dispatch(updatePasswordAction(data)),
    updateAvatar: (data) => dispatch(updateAvatarAction(data)),
    getUserCategories: () => dispatch(getUserCategoriesAction()),
    attachCategoryToUser: (data) => dispatch(attachUserCategoryAction(data)),
    detachCategoryFromUser: (data) => dispatch(detachUserCategoryAction(data)),
    getActiveSubscription: () => dispatch(getActiveSubscriptionAction()),
    getCurrentSubscription: () => dispatch(getCurrentSubscriptionAction()),
    getCardInfo: () => dispatch(getCardInfoAction()),
    getPaymentMethods: () => dispatch(getPaymentMethodsAction()),
    cancelSubscription: (data) => dispatch(cancelSubscriptionAction(data)),
    logout: () => dispatch(logoutAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(StudentProfilePage);
