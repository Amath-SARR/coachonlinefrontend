/**
 *
 * LibraryDataForm
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LibraryDataFormProps } from './index.props';
import { BASE_URL } from '../../../config/env';
import { B2BAccount, B2BLibrary } from '../../../containers/B2B/index.props';
import { countries } from '../../../utils/countries';
import { ProfilePictureWrapper } from '../../../containers/Profiles/styles';
import messages from '../../messages';
import { FlexRow, Text } from '../../../global-styles';
import FileInput from '../../FileInput';
import Input from '../../Input';
import InputSubmit from '../../InputSubmit';
import SelectInput from '../../SelectInput';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const PictureColumn = styled.div`
  flex: 1;
`;
const Row = styled(FlexRow)``;
const Form = styled.form`
  flex: 2;
`;

const registerLinkSchema = yup.object().shape({
  subdomain: yup
    .string()
    .max(30)
    .matches(/^[a-zA-Z0-9]+$/, 'No special characters, no spaces')
    .required(),
});

function LibraryDataForm(props: LibraryDataFormProps) {
  const { library, onSubmit, onLinkSubmit } = props;
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, errors, control } = useForm({
    // resolver: yupResolver(registerSchema)
  });
  const {
    register: registerLink,
    handleSubmit: handleSubmitLink,
    errors: errorsLink,
  } = useForm({
    resolver: yupResolver(registerLinkSchema),
  });

  useEffect(() => {
    console.log('Selected library', library);
    const { photoUrl } = library || {};
    if (photoUrl) {
      setImagePreview(`${BASE_URL}images/${photoUrl}`);
    }
  }, [library?.id]);

  const onProfilePictureChange = () => null;
  const submit = (data: B2BLibrary) => {
    onSubmit({ ...data, id: library?.id });
  };
  const submitLink = (data: { subdomain: string }) => {
    // onSubmit({ ...data, id: library?.id });
    onLinkSubmit(data.subdomain);
    console.log(data);
  };
  const libraryCountry = countries?.filter((country) => country.value === library?.country)?.[0];

  return (
    <Wrapper>
      <Row>
        <PictureColumn>
          <ProfilePictureWrapper>
            <FileInput
              aspectRatio={1 / 0.75}
              dark={false}
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
              onInput={onProfilePictureChange}
            />
          </ProfilePictureWrapper>
          <Form onSubmit={handleSubmitLink(submitLink)} style={{ margin: '20px 10px' }}>
            <Text>
              Indiquez un nom de sous-domaine pour le lien de votre bibliothèque. Par exemple, si
              vous indiquez 'exemple', le lien sera créé sur https://exemple.coachs-online.com si le
              nom n'est pas déjà pris. Ce lien sera utilisé par vos utilisateurs pour s'inscrire sur
              la plate-forme. <br />
              La modification de ce lien désactivera le lien précédent, si vous en aviez un. <br />
              Aucun espace ou caractère spécial n'est autorisé.
            </Text>
            <Input
              inputProps={{
                ref: registerLink,
                name: 'subdomain',
                defaultValue: library?.institutionLink,
              }}
              error={errorsLink.subdomain?.message}
            />
            <InputSubmit
              value="SAUVEGARDER"
              style={{ marginBottom: '10px', flex: 1, width: 200, margin: 'auto' }}
            />
          </Form>
        </PictureColumn>
        <Form onSubmit={handleSubmit(submit)}>
          <Input
            inputProps={{
              ref: register,
              name: 'email',
              defaultValue: library?.email,
            }}
            labelName={messages.Email}
            error={errors.email?.email}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'phoneNo',
              defaultValue: library?.phoneNo,
            }}
            labelName={messages.phoneNo}
            error={errors?.phoneNo?.message}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'libraryName',
              defaultValue: library?.libraryName,
            }}
            labelName={messages.libraryName}
            error={errors?.libraryName?.message}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'street',
              defaultValue: library?.street,
            }}
            labelName={messages.address}
            error={errors?.address?.message}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'postalCode',
              defaultValue: library?.postalCode,
            }}
            labelName={messages.postalCode}
            error={errors?.postalCode?.message}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'city',
              defaultValue: library?.city,
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
            defaultValue2={libraryCountry}
            defaultValue={libraryCountry}
            placeholderProp="--Sélectionnez votre pays--"
            as={SelectInput}
          />
          <Input
            inputProps={{
              ref: register,
              name: 'website',
              defaultValue: library?.website,
            }}
            labelName={messages.website}
            error={errors.website?.city}
          />
          <InputSubmit
            value="SAUVEGARDER"
            style={{ marginBottom: '10px', flex: 1, width: 200, margin: 'auto' }}
          />
        </Form>
      </Row>
    </Wrapper>
  );
}

export default LibraryDataForm;
