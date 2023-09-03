/**
 *
 * LibraryStructureForm
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { BASE_URL } from '../../../config/env';
import { B2BLibrary } from '../../../containers/B2B/index.props';
import { countries } from '../../../utils/countries';
import messages from '../../messages';
import { LibraryStructureFormProps } from './index.props';
import { FlexColumn, FlexRow, Title } from '../../../global-styles';
import InputSubmit from '../../InputSubmit';
import Input from '../../Input';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Column = styled(FlexColumn)`
  flex: 1;
  margin: 0 20px;
`;
const Row = styled(FlexRow)``;
const Form = styled.form``;

function LibraryStructureForm(props: LibraryStructureFormProps) {
  const { library, onSubmit } = props;
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, errors, control } = useForm({
    // resolver: yupResolver(registerSchema)
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

  const libraryCountry = countries?.filter((country) => country.value === library?.country)?.[0];

  return (
    <Wrapper>
      <Title>Informations sur la structure</Title>
      <Form onSubmit={handleSubmit(submit)}>
        <Row>
          <Column>
            <Input
              inputProps={{
                ref: register,
                name: 'booksNo',
                defaultValue: library?.booksNo,
                type: 'number',
              }}
              labelName={messages.booksNo}
              error={errors.booksNo?.message}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'readersNo',
                defaultValue: library?.readersNo,
                type: 'number',
              }}
              labelName={messages.readersNo}
              error={errors.readersNo?.message}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'sigbName',
                defaultValue: library?.sigbName,
              }}
              labelName={messages.sigbName}
              error={errors.sigbName?.message}
            />
          </Column>
          <Column>
            <Input
              inputProps={{
                ref: register,
                name: 'cdsNo',
                defaultValue: library?.cdsNo,
                type: 'number',
              }}
              labelName={messages.cdsNo}
              error={errors.cdsNo?.message}
            />
            <Input
              inputProps={{
                ref: register,
                name: 'videosNo',
                defaultValue: library?.videosNo,
                type: 'number',
              }}
              labelName={messages.videosNo}
              error={errors.videosNo?.message}
            />
            <InputSubmit
              value="SAUVEGARDER"
              style={{ marginBottom: '10px', flex: 1, width: 200, margin: 'auto' }}
            />
          </Column>
        </Row>
      </Form>
    </Wrapper>
  );
}

export default LibraryStructureForm;
