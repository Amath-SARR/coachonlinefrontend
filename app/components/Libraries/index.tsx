/**
 *
 * Libraries
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { CreateLibraryForm, LibrariesProps } from './index.props';
import useWindowSize from '../../hooks/useWindowSize';
import history from '../../utils/history';
import { BASE_URL } from '../../config/env';
import { colors } from '../../utils/colors';
import CreateAccountForm from '../CreateAccountForm';
import Modal from '../Modal';
import Button from '../Button';
import makeSelectB2B from '../../containers/B2B/selectors';
import {
  changeLibrarySubscriptionAction,
  createCompanyAction,
  createLibraryAction,
  getCompaniesAction,
  getLibrariesAction,
  setCompanyAction,
  setLibraryAction,
} from '../../containers/B2B/actions';
import Image from '../Image';
import { ChangeLibrarySubscriptionActionData } from '../../containers/B2B/actions.props';
import { RegisterForm } from '../CreateAccountForm/index.props';
import { B2BLibrary } from '../../containers/B2B/reducer.types';
import { RequestActions } from '../../types';
import {
  CreateLibraryActionData,
  GetLibrariesActionData,
} from '../../containers/B2B/actions.types';
import { setProfileAction } from '../../containers/Libraries/actions';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  @media screen and (max-width: 600px) {
    padding: 0;
  }
`;
const Title = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props: { isHeader?: boolean }) => !props.isHeader && colors.inputBlue};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: 500px;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;

type TableItemProps = {
  isHeader?: boolean;
  textAlign?: 'left' | 'right' | 'center';
};
const TableItem = styled.div`
  min-width: 50px;
  width: calc(100% / 6);
  font-size: 12px;
  font-weight: ${(props: TableItemProps) => (props.isHeader ? 600 : 300)};
  color: ${colors.white};
  cursor: pointer;
  text-align: ${(props: TableItemProps) => props.textAlign || 'center'};
  padding: 10px 0;
`;
const StyledLink = styled.a``;
const ModalBody = styled.div`
  max-width: 400px;
  margin: auto;
`;
const HEADERS = [
  {
    label: 'Nom',
  },
  {
    label: 'Logo',
  },
  {
    label: 'Country',
  },
];

const modalStyle = (width: number) => ({
  overlay: {
    backgroundColor: `${colors.backgroundDarkBlue}E6`,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    minHeight: '500px',
    maxWidth: '600px',
    width: '100%',
  },
});

function Libraries(props: LibrariesProps) {
  const { id } = useParams();
  const { b2B, setLibrary, getLibraries, createLibrary } = props;
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = () =>
    getLibraries({ body: { token: b2B.b2bAuthToken }, actions: { onFinish: onFetchFinish } });

  const onFetchFinish = () => setLoading(false);

  const onLibraryCreate = (values: CreateLibraryActionData['body']) => {
    createLibrary({
      body: { ...values, token: b2B.b2bAuthToken },
      actions: {
        onFinish: () => {
          onCreateModalClose();
          fetchLibraries();
        },
      },
    });
  };

  const goToLibrary = (library: B2BLibrary | null) => {
    setLibrary(library);
    setTimeout(() => history.push(`/libraries/${library?.id}/profile/settings`), 300);
  };

  const onItemClick = (library: B2BLibrary | null) => {
    console.log('On item click', library);
    setLibrary(library);
    goToLibrary(library);
  };

  const onCreateModalOpen = () => setCreateModalOpened(true);
  const onCreateModalClose = () => setCreateModalOpened(false);

  const renderTableHeaders = () => (
    <TableRow isHeader>
      {HEADERS.map((header) => (
        <TableItem textAlign="center" isHeader key={header.label}>
          {header.label}
        </TableItem>
      ))}
    </TableRow>
  );

  const renderTableLibraries = () =>
    b2B.libraries?.map((library: B2BLibrary) => (
      <TableRow key={library.id} onClick={() => onItemClick(library)}>
        <TableItem>{library.libraryName}</TableItem>
        <TableItem>
          <Image
            style={{ width: 100, height: 100, objectFit: 'contain' }}
            src={`${BASE_URL}images/${library.photoUrl}`}
          />
        </TableItem>
        <TableItem>{library.country}</TableItem>
      </TableRow>
    ));
  return (
    <Wrapper>
      {loading && (
        <LoaderWrapper>
          <Loader type="Oval" color={colors.mainGreen} height={30} width={30} />
        </LoaderWrapper>
      )}
      {renderTableHeaders()}
      {renderTableLibraries()}
      <Button
        onClick={onCreateModalOpen}
        style={{ width: 'fit-content', padding: '10px 20px', margin: 'auto' }}
        color="green"
      >
        Créer Accès Entreprise
      </Button>
      <Modal
        ariaHideApp={false}
        isOpened={createModalOpened}
        style={modalStyle(width)}
        onClose={onCreateModalClose}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <ModalBody>
          <CreateAccountForm
            fields={['email', 'password', 'repeatPassword']}
            onSubmit={onLibraryCreate}
            submitLabel={"Créer Accès pour l'Entreprise"}
          />
        </ModalBody>
      </Modal>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  b2B: makeSelectB2B(),
});

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
    getLibraries: (data: GetLibrariesActionData) => dispatch(getLibrariesAction(data)),
    setLibrary: (data: B2BLibrary | null) => dispatch(setProfileAction(data)),
    createLibrary: (data: CreateLibraryActionData) => dispatch(createLibraryAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Libraries);
