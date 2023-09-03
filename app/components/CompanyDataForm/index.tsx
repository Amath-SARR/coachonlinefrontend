/**
 *
 * CompanyDataForm
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DateInput } from 'grommet';
import { CompanyDataFormProps } from './index.props';
import { BASE_URL } from '../../config/env';
import FileInput from '../FileInput';
import Input from '../Input';
import messages from '../messages';
import { countries } from '../../utils/countries';
import SelectInput from '../SelectInput';
import InputSubmit from '../InputSubmit';
import { FlexCenteredColumn, FlexRow } from '../../global-styles';
import CheckBox from '../CheckBox';
import { B2BProfileData } from '../../containers/B2B/reducer.types';
import { ProfilePictureWrapper } from '../../containers/Profile/ProfilePage';
import Label from '../Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Form = styled.form`
  flex: 2;
`;

function CompanyDataForm(props: CompanyDataFormProps) {
  const { id } = useParams();
  const { company, onSubmit } = props;
  const [imagePreview, setImagePreview] = useState('');
  const [contractSigned, setContractSigned] = useState(company?.contractSigned);
  const [contractSignDate, setContractSignDate] = useState(company?.contractSignDate);

  const { register, handleSubmit, errors, control } = useForm({
    // resolver: yupResolver(registerSchema)
  });

  useEffect(() => {
    setContractSignDate(company?.contractSignDate);
    setContractSigned(company?.contractSigned);
  }, [company?.contractSigned]);

  useEffect(() => {
    console.log('Selected company', company);
    const { photoUrl } = company || {};
    if (photoUrl) {
      setImagePreview(`${BASE_URL}images/${photoUrl}`);
    }
  }, [company?.id]);

  const onProfilePictureChange = () => null;
  const submit = (data: B2BProfileData) => {
    onSubmit({
      ...data,
      contractSigned: !!contractSigned,
      contractSignDate,
      comissionCurrency: 'eur',
      id,
    });
  };

  const onContractSignChange = (val: boolean) => setContractSigned(val);

  const companyCountry = countries?.filter((country) => country.value === company?.country)?.[0];

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(submit)}>
        <CheckBox
          label="Contract signed"
          readOnly
          onChange={onContractSignChange}
          checked={contractSigned}
          style={{ margin: '0 0 20px 0' }}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'comission',
            defaultValue: company?.comission,
            type: 'number',
            readOnly: true,
          }}
          labelName={messages.commission}
          error={errors.comission?.message}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'email',
            defaultValue: company?.email,
          }}
          labelName={messages.Email}
          error={errors.email?.email}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'phoneNo',
            defaultValue: company?.phoneNo,
          }}
          labelName={messages.phoneNo}
          error={errors?.phoneNo?.message}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'accountName',
            defaultValue: company?.accountName,
          }}
          labelName={messages.accountName}
          error={errors?.accountName?.message}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'street',
            defaultValue: company?.street,
          }}
          labelName={messages.address}
          error={errors?.address?.message}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'postalCode',
            defaultValue: company?.postalCode,
          }}
          labelName={messages.postalCode}
          error={errors?.postalCode?.message}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'city',
            defaultValue: company?.city,
          }}
          labelName={messages.City}
          error={errors.name?.city}
        />
        <Controller
          redesigned
          name="country"
          error={errors?.country?.message}
          control={control}
          options={countries}
          labelName={messages.country}
          defaultValue2={companyCountry}
          defaultValue={companyCountry}
          placeholderProp="--Sélectionnez votre pays--"
          as={SelectInput}
        />
        <Input
          redesigned
          inputProps={{
            ref: register,
            name: 'website',
            defaultValue: company?.website,
          }}
          labelName={messages.website}
          error={errors.website?.city}
        />
        <InputSubmit
          value="SAUVEGARDER"
          style={{ marginBottom: '10px', flex: 1, width: 200, margin: 'auto' }}
        />
      </Form>
    </Wrapper>
  );
}

export default CompanyDataForm;
