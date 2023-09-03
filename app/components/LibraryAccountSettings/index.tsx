/**
 *
 * LibraryAccountSettings
 *
 */

import React from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import messages from '../messages';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { logoutAction } from '../../containers/Auth/actions';
import makeSelectAuth from '../../containers/Auth/selectors';
import Input from '../Input';
import InputSubmit from '../InputSubmit';
import * as yup from 'yup';
import { FlexColumn, FlexRow, Text } from '../../global-styles';
import { LongBox } from '../../containers/Profile/LibraryProfilePage';
import { DataRow, Label, Value } from '../LibraryStatistics';
import makeSelectLibraries from '../../containers/Libraries/selectors';
import { B2BLibrary } from '../../containers/Libraries/reducer.types';
import { colors } from '../../utils/colors';
import { localizeDate } from '../../utils/localize';
import ShareableLink from '../SharebaleLink';
import LibrarySubscription from '../Libraries/LibrarySubscription';
import makeSelectB2B from '../../containers/B2B/selectors';
import { B2BCompanyService } from '../../containers/B2B/reducer.types';
import { yupValidators } from '../../utils/validate';

const Wrapper = styled(FlexColumn)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
`;
const Column = styled.div`
  flex: 1;
  padding: 10px 15px;
  @media screen and (max-width: 1024px) {
    padding: 10px 0;
  }
`;
const Row = styled(FlexRow)`
  @media screen and (max-width: 1030px) {
    flex-direction: column;
  }
`;
const Form = styled.form`
  width: 100%;
  max-width: 700px;
`;
const LinkContainer = styled.div`
  width: 100%;
  max-width: 700px;
`;
const StatisticsInputStyle = {
  // backgroundColor: colors.backgroundBlue,
  textAlign: 'center',
  // padding: '0 5px',
  fontSize: '21px',
  fontWeight: 700,
  maxWidth: '200px',
};

const registerSchema = yup.object().shape({
  phoneNo: yupValidators.phoneNo,
});
const registerLinkSchema = yup.object().shape({
  subdomain: yup
    .string()
    .max(30)
    .matches(/^[a-zA-Z0-9]+$/, 'No special characters, no spaces')
    .required(),
});
function LibraryAccountSettings({
  libraries,
  b2B,
  libraryId,
  profileData,
  onChangeLink,
  onSubmit: onFormSubmit,
  onSubscriptionSelect,
  onSubscriptionCancel,
}) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const {
    register: registerLink,
    handleSubmit: handleSubmitLink,
    errors: errorsLink,
  } = useForm({
    resolver: yupResolver(registerLinkSchema),
  });

  const submitLink = (data: { subdomain: string }) => {
    // onSubmit({ ...data, id: library?.id });
    onChangeLink({ link: data.subdomain, libraryId });
    console.log(data);
  };

  const onSubmit = (data: B2BLibrary) => onFormSubmit(data);

  const onServiceSelect = (subscription: B2BCompanyService) => onSubscriptionSelect(subscription);
  const onServiceCancel = (subscription: B2BCompanyService) => onSubscriptionCancel(subscription);

  return (
    <Wrapper>
      <LongBox>
        <Column>
          {!!libraryId && (
            <Form onSubmit={handleSubmitLink(submitLink)} style={{ margin: '20px 10px' }}>
              <Text>
                Indiquez un nom de sous-domaine pour le lien de votre bibliothèque. Par exemple, si
                vous indiquez 'exemple', le lien sera créé sur
                https://inscription.coachs-online.com/library/example si le nom n'est pas déjà pris.
                Ce lien sera utilisé par vos utilisateurs pour s'inscrire sur la plate-forme. <br />
                La modification de ce lien désactivera le lien précédent, si vous en aviez un.{' '}
                <br />
                Aucun espace ou caractère spécial n'est autorisé.
              </Text>
              <Input
                redesigned
                label={'Lien'}
                colorScheme={'dark'}
                inputProps={{
                  ref: registerLink,
                  name: 'subdomain',
                  defaultValue: profileData?.institutionLink,
                }}
                error={errorsLink.subdomain?.message}
              />
              <InputSubmit
                value="SAUVEGARDER"
                style={{ marginBottom: '10px', flex: 1, width: 200, margin: '0 auto 20px auto' }}
              />
            </Form>
          )}
          <LinkContainer>
            <Text style={{ padding: '0 10px' }}>
              Les étudiants inscrits sous ce lien auront accès à tous les cours de la plateforme
              tant que votre compte dispose d'un abonnement actif. <br /> Note : Le lien est généré
              manuellement par le compte de votre société de distribution ou par l'administrateur de
              coachs-online.com. Si vous ne voyez pas le lien ci-dessous, veuillez contacter la
              société de distribution ou l'administrateur.
            </Text>
            <ShareableLink
              wrapperStyle={{ display: 'flex', alignItems: 'center' }}
              link={profileData?.link}
              label={'Lien vers la bibliothèque'}
            />
          </LinkContainer>
        </Column>
        <Row>
          <Column>
            <Label style={{ textAlign: 'center', fontWeight: 600, fontSize: 26, margin: '10px 0' }}>
              Informations sur la bibliothèque
            </Label>
            <form
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'street',
                  defaultValue: profileData?.street,
                }}
                labelName={messages.address}
                error={errors?.street?.message}
              />
              <Input
                redesigned
                alignment={'row'}
                colorScheme="dark"
                inputProps={{
                  ref: register,
                  name: 'phoneNo',
                  defaultValue: profileData?.phoneNo,
                  type: 'tel',
                }}
                labelName={messages.phoneNo}
                error={errors?.phoneNo?.message}
              />
              <Input
                redesigned
                alignment={'row'}
                colorScheme="dark"
                inputProps={{
                  ref: register,
                  name: 'email',
                  defaultValue: profileData?.email,
                  type: 'e-mail',
                }}
                labelName={messages.Email}
                error={errors?.phoneNo?.message}
              />
              <InputSubmit
                disableOnFetch
                value="Sauvegarder"
                style={{ marginBottom: '10px', flex: 1, margin: '10px auto' }}
                inputStyle={{ width: 'fit-content', minWidth: '200px' }}
              />
            </form>
          </Column>
          <Column>
            <Label style={{ textAlign: 'center', fontWeight: 600, fontSize: 26, margin: '10px 0' }}>
              Personne de contact
            </Label>
            <Input
              redesigned
              colorScheme="dark"
              alignment={'row'}
              inputProps={{
                // ref: register,
                name: 'street',
                defaultValue: profileData?.referents?.[0]?.street,
                readOnly: true,
              }}
              labelName={messages.address}
              // error={errors?.street?.message}
            />
            <Input
              redesigned
              alignment={'row'}
              colorScheme="dark"
              inputProps={{
                // ref: register,
                name: 'phoneNo',
                defaultValue: profileData?.referents?.[0]?.phoneNo,
                type: 'tel',
                readOnly: true,
              }}
              labelName={messages.phoneNo}
              // error={errors?.phoneNo?.message}
            />
            <Input
              redesigned
              alignment={'row'}
              colorScheme="dark"
              inputProps={{
                // ref: register,
                name: 'email',
                defaultValue: profileData?.referents?.[0]?.email,
                type: 'e-mail',
                readOnly: true,
              }}
              labelName={messages.Email}
              // error={errors?.email?.message}
            />
          </Column>
        </Row>
      </LongBox>
      <LongBox>
        <form
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row style={{ maxWidth: '800px', width: '100%' }}>
            <Column>
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'readersNo',
                  defaultValue: profileData?.readersNo,
                  style: { ...StatisticsInputStyle },
                }}
                label={'Nombre de lecteurs'}
                style={{ justifyContent: 'space-between' }}
                error={errors?.readersNo?.message}
              />
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'booksNo',
                  defaultValue: profileData?.booksNo,
                  style: { ...StatisticsInputStyle },
                }}
                label={'Nombre de livres'}
                style={{ justifyContent: 'space-between' }}
                error={errors?.booksNo?.message}
              />
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'cdsNo',
                  defaultValue: profileData?.cdsNo,
                  style: { ...StatisticsInputStyle },
                }}
                label={'Nombre de CD'}
                style={{ justifyContent: 'space-between' }}
                error={errors?.cdsNo?.message}
              />
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'videosNo',
                  defaultValue: profileData?.videosNo,
                  style: { ...StatisticsInputStyle },
                }}
                label={'Nombre de vidéos'}
                style={{ justifyContent: 'space-between' }}
                error={errors?.videosNo?.message}
              />
            </Column>
            <Column>
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'libraryName',
                  defaultValue: profileData?.libraryName,
                  style: { ...StatisticsInputStyle },
                }}
                label={'Nom de la plateforme de la bibliothèque'}
                style={{ justifyContent: 'space-between' }}
                error={errors?.libraryName?.message}
              />
              <Input
                redesigned
                colorScheme="dark"
                alignment={'row'}
                inputProps={{
                  ref: register,
                  name: 'sigbName',
                  defaultValue: profileData?.sigbName,
                  style: { ...StatisticsInputStyle },
                }}
                style={{ justifyContent: 'space-between' }}
                label={'Nom en SIGB'}
                error={errors?.sigbName?.message}
              />
              {/*<InfoRow>*/}
              {/*  <Label>List of subscribed digital resources</Label>*/}
              {/*  <Value></Value>*/}
              {/*</InfoRow>*/}
            </Column>
          </Row>
          <InputSubmit
            disableOnFetch
            value="Sauvegarder"
            style={{ marginBottom: '10px', flex: 1, margin: '10px auto' }}
            inputStyle={{ width: 'fit-content', minWidth: '200px' }}
          />
        </form>
      </LongBox>
      <LongBox>
        <Row style={{ maxWidth: '800px', width: '100%' }}>
          <LibrarySubscription
            services={b2B.profileData?.availableServices}
            library={profileData}
            canModify={!!libraryId}
            onServiceSelect={onServiceSelect}
            onServiceCancel={onServiceCancel}
          />
        </Row>
      </LongBox>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
    logout: () => dispatch(logoutAction()),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  libraries: makeSelectLibraries(),
  b2B: makeSelectB2B(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LibraryAccountSettings);
