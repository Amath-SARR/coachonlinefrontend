/**
 *
 * ProfilePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from '@reduxjs/toolkit';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../../components/Input';
import InputSubmit from '../../../components/InputSubmit';
import InputTextarea from '../../../components/InputTextarea';
import makeSelectAuth from '../../Auth/selectors';
import {
  attachUserCategoryAction,
  deleteAccountAction,
  detachUserCategoryAction,
  getUserBasicDataAction,
  getUserCategoriesAction,
  logoutAction,
  updateAvatarAction,
  updateUserDataAction,
} from '../../Auth/actions';
import { BASE_URL } from '../../../config/env';
import SelectInput from '../../../components/SelectInput';
import messages from '../../../components/messages';
import PageContainer from '../../../components/PageContainer';
import makeSelectDashboard from '../../Dashboard/selectors';
import makeSelectSubscription from '../../Subscription/selectors';
import CategorySuggester from '../../../components/CategorySuggester';
import { suggestCategoryAction } from '../../Dashboard/actions';
import CredentialsForm from '../../../components/CredentialsForms';
import { countries } from '../../../utils/countries';
import Tabs from '../../../components/Tabs';
import DeleteAccountButton from '../../../components/DeleteAccountButton';
import FileInput from '../../../components/FileInput';
import AffiliationInfo from '../../../components/AffiliationInfo';
import { colors } from '../../../utils/colors';
import { FlexRow } from '../../../global-styles';
import AddImageImg from '../../../images/icons/addImage.svg';
import { yupValidators } from '../../../utils/validate';
import IFrame from '../../../components/IFrame/i-frame';
import { wixLinks } from '../../../components/HomePageAffiliationSection/links';
import CVAttachment from '../../../components/CVAttachment';

export const ProfilePictureWrapper = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 20px;
  background-position: center center;
  background-color: lightgrey;
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  @media screen and (max-width: 460px) {
    margin-top: 50px;
    width: 180px;
    height: 180px;
  }
`;
const InputColumns = styled.div`
  display: flex;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;
const TabBody = styled.div`
  padding: 20px;
  min-width: 100%;
  max-width: 1000px;
  @media screen and (max-width: 460px) {
    max-width: 250px;
  }
  ${(props) => props.style};
`;
const OutsideContainer = styled(FlexRow)`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
  margin: auto;
  padding-top: 25px;
`;
const DeleteAccountButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const Title = styled.p`
  margin-top: 70px;
  margin-left: 60px;
  margin-right: 60px;
  font-size: 25px;
  text-align: center;
  color: ${colors.lilac};
  padding: 20px;
  border-bottom: 1px solid ${colors.lilac};
  @media screen and (max-width: 900px) {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 20px;
    word-break: keep-all;
  }
`;

const registerSchema = yup.object().shape({
  phoneNo: yupValidators.phoneNo,
});

const TABS = [
  {
    label: <FormattedMessage {...messages.accountSettings} />,
    id: 'profile-settings',
  },
  { label: 'Parrainage', id: 'affiliation' },
];
export function ProfilePage({
  history,
  getUserData,
  updateUserData,
  auth,
  updateAvatar,
  getUserCategories,
  attachCategoryToUser,
  detachCategoryFromUser,
  deleteAccount,
  logout,
  suggestCategory,
  addAttachments,
}) {
  const { tabId } = useParams();
  const [imagePreview, setImagePreview] = useState('');
  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const [activeTab, setActiveTab] = useState(0);
  const [bio, setBio] = useState(auth.userDataFetched.bio);
  const [imageLoading, setImageLoading] = useState(false);
  const [certifPreview, setCertifPreview] = useState('');
  const [avisPreview, setAvisPreview] = useState('');

  const onSubmit = (data) => updateUserData({ ...data, bio });

  useEffect(() => {
    console.log('Tab id', tabId);
    tabId && setActiveTab(TABS.findIndex((tab) => tab.id === tabId));
  }, []);

  useEffect(() => {
    getUserData();
    getUserCategories();
  }, []);

  useEffect(() => {
    const { photoUrl } = auth.userDataFetched;
    if (photoUrl) {
      setImagePreview(`${BASE_URL}images/${photoUrl}`);
    }
  }, [auth.userDataFetched?.photoUrl]);
  //bouchon pour les nouveaux champs concernant le Coach
  const data = {
    cv: '',
    socialProof: '',
    certifications: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  };

  // useEffect pour l'upload des images des certifications
  useEffect(() => {
    const { certificationUrl } = data.certifications;
    if (certificationUrl) {
      setCertifPreview(`${BASE_URL}images/${certificationUrl}`);
    }
  }, []);

  // useEffect pour l'upload des images des avis
  useEffect(() => {
    const { avisUrl } = data.socialProof;
    if (avisUrl) {
      setAvisPreview(`${BASE_URL}images/${avisUrl}`);
    }
  }, []);
  useEffect(() => {
    setBio(auth.userDataFetched.bio);
  }, [auth.userDataFetched.bio]);

  const onPictureChange = (img) => {
    setImageLoading(true);
    updateAvatar({
      data: img,
      remove: false,
      onFinish: () => setImageLoading(false),
    });
  };

  const mergeCategories = (categories) => {
    const listOfCategories = [];
    categories?.forEach((item) => {
      listOfCategories.push({ label: item.name, value: item.id });
      item.children?.forEach((child) => {
        listOfCategories.push({ label: child.name, value: child.id });
      });
    });
    return listOfCategories;
  };

  const onTabChange = (index, tab) => {
    setActiveTab(index);
    history.replace(`/profile/${tab.id}`);
  };

  if (auth.loading) {
    return null;
  }
  console.log(auth);

  const userCountry = countries?.filter(
    (country) => country.value === auth.userDataFetched?.country,
  )?.[0];

  // pour upload les avis et ou les qualification, au format image.
  const onImageInput = (img) => {
    setImageLoading(true);
    // uploadCoursePhoto({ base64: img, onFinish: () => setImageLoading(false) });
  };

  return (
    <div>
      <Helmet>
        <title>ProfilePage</title>
        <meta name="description" content="Description of ProfilePage" />
      </Helmet>
      <PageContainer
        withPanel
        title={<FormattedMessage {...messages.profile} />}
        style={{ marginLeft: '50px' }}
        renderOutsideChildrenWrapper={(() => (
          <OutsideContainer>
            <ProfilePictureWrapper>
              <FileInput
                aspectRatio={1 / 0.75}
                dark={false}
                loading={imageLoading}
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 'unset',
                }}
                dropAreaStyle={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 'unset',
                }}
                imageStyle={{
                  width: '100%',
                  height: '100%',
                }}
                useCropper
                imagePreview={imagePreview}
                onInput={onPictureChange}
              >
                <img src={AddImageImg} />
              </FileInput>
            </ProfilePictureWrapper>
            <DeleteAccountButtonWrapper>
              <DeleteAccountButton style={{ color: colors.black }} />
            </DeleteAccountButtonWrapper>
          </OutsideContainer>
        ))()}
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
              borderBottom: `1px solid ${colors.mainPink}`,
            },
            tabTextStyle: {
              color: 'black',
            },
          }}
          tabs={TABS}
        >
          <TabBody>
            <div style={{ flex: 1 }}>
              <InputTextarea
                editor={InlineEditor}
                inputProps={{
                  defaultValue: bio,
                  onChange: (data) => setBio(data),
                }}
                textareaStyle={{ maxHeight: '200px' }}
                labelName={messages.Bio}
                error={errors.name?.bio}
              />
            </div>
            <div style={{ flex: 2 }}>
              <InputColumns>
                <div style={{ flex: 1, padding: '0 15px' }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'firstName',
                        defaultValue: auth.userDataFetched.firstName,
                      }}
                      labelName={messages.firstName}
                      error={errors.name?.firstName}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'lastName',
                        defaultValue: auth.userDataFetched.lastName,
                      }}
                      labelName={messages.Surname}
                      error={errors.name?.lastName}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'birthDate',
                        defaultValue: auth.userDataFetched.yearOfBirth,
                      }}
                      labelName={messages.birthDate}
                      error={errors.name?.birthDate}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'phoneNo',
                        defaultValue: auth.userDataFetched?.phoneNo,
                      }}
                      labelName={messages.phoneNo}
                      error={errors?.phoneNo?.message}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'address',
                        defaultValue: auth.userDataFetched?.address,
                      }}
                      labelName={messages.address}
                      error={errors?.address?.message}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'postalCode',
                        defaultValue: auth.userDataFetched?.postalCode,
                      }}
                      labelName={messages.postalCode}
                      error={errors?.postalCode?.message}
                    />
                    <Input
                      inputProps={{
                        ref: register,
                        name: 'city',
                        defaultValue: auth.userDataFetched?.city,
                      }}
                      labelName={messages.City}
                      error={errors.name?.city}
                    />

                    <Controller
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
                      name="gender"
                      control={control}
                      options={[
                        { value: 'Male', label: 'Homme' },
                        { value: 'Female', label: 'Femme' },
                      ]}
                      labelName={messages.Gender}
                      defaultValue2={{
                        value: auth?.userDataFetched.gender,
                        label: auth?.userDataFetched.gender && (
                          <FormattedMessage {...messages[auth?.userDataFetched.gender]} />
                        ),
                      }}
                      as={SelectInput}
                    />
                    <Controller
                      name="category"
                      control={control}
                      onSelectMulti={(item, payload) =>
                        attachCategoryToUser({ categoryId: item.value })
                      }
                      options={mergeCategories(auth.categories)}
                      labelName={messages.categories}
                      isMulti
                      onRemove={(item) => detachCategoryFromUser({ categoryId: item.value })}
                      defaultValue2={auth.userDataFetched.categories?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      as={SelectInput}
                    />
                    <CategorySuggester
                      categories={mergeCategories(auth.categories)}
                      canAddParentCategory={false}
                      onCategorySuggest={suggestCategory}
                    />

                    <InputSubmit
                      background={colors.mainPink}
                      color={colors.white}
                      value="SAUVEGARDER"
                      style={{ marginBottom: '10px', flex: 1 }}
                    />
                  </form>
                </div>
                <div style={{ flex: 1, padding: '0 15px' }}>
                  <CredentialsForm redesigned={false} />
                  {/* <Title> Informations Professionnelles</Title>
                  <CVAttachment />
                  <Input
                    inputProps={{
                      ref: register,
                      name: 'linkedIn',
                      defaultValue: data.linkedin,
                    }}
                    label="LinkedIn"
                    error={''}
                  />
                  <Input
                    inputProps={{
                      ref: register,
                      name: 'facebook',
                      defaultValue: data.facebook,
                    }}
                    label="Facebook"
                    error={''}
                  />
                  <p>Ajoutez vos certifications (diplomes, attestation,...) :</p>
                  <FileInput
                    useCropper
                    loading={imageLoading}
                    dark={false}
                    imagePreview={certifPreview}
                    onInput={onImageInput}
                  />
                  <p>Ajoutez vos avis (google, facebook,...) :</p>
                  <FileInput
                    useCropper
                    loading={imageLoading}
                    dark={false}
                    imagePreview={avisPreview}
                    onInput={onImageInput}
                  /> */}
                </div>
              </InputColumns>
            </div>
          </TabBody>
          <TabBody>
            <AffiliationInfo withPayPal dark={false} accent={colors.mainPink} />
            <IFrame src={wixLinks.coachAffiliation.url} initHeight={700} />
          </TabBody>
        </Tabs>
      </PageContainer>
    </div>
  );
}

ProfilePage.propTypes = {
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
    updateAvatar: (data) => dispatch(updateAvatarAction(data)),
    getUserCategories: () => dispatch(getUserCategoriesAction()),
    attachCategoryToUser: (data) => dispatch(attachUserCategoryAction(data)),
    detachCategoryFromUser: (data) => dispatch(detachUserCategoryAction(data)),
    deleteAccount: () => dispatch(deleteAccountAction()),
    logout: () => dispatch(logoutAction()),
    suggestCategory: (data) => dispatch(suggestCategoryAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ProfilePage);
