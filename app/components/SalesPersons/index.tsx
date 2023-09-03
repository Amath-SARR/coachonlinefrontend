/**
 *
 * SalesPersons
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { colors } from '../../utils/colors';
import CreateAccountForm from '../CreateAccountForm';
import useWindowSize from '../../hooks/useWindowSize';
import Image from '../Image';

import { BASE_URL } from '../../config/env';
import { SalesPersonsProps } from './index.props';
import Button from '../Button';
import Modal from '../Modal';
import { fullName } from '../../utils/formatters';
import { FlexCenteredColumn } from '../../global-styles';
import { B2BSalesPerson } from '../../containers/B2B/reducer.types';

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
const ModalBody = styled.div`
  max-width: 400px;
  margin: auto;
`;
const HEADERS = [
  {
    label: 'Nom',
  },
  {
    label: 'L’image',
  },
  {
    label: 'E-mail référent (client / bibliothèque) donne accès aux statistiques pour le client  ',
  },
  {
    label: 'Telefon',
  },
  // {
  //   label: 'Actions',
  // },
];

const modalStyle = (width: number) => ({
  overlay: {
    backgroundColor: `${colors.black}E6`,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.white} 100%)`,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    minHeight: '500px',
    maxWidth: '600px',
    width: '100%',
  },
});

function SalesPersons(props: SalesPersonsProps) {
  const {
    salesPersons,
    createPerson,
    updatePerson,
    deletePerson,
    onFinish: onRequestFinish = () => null,
  } = props;
  const { width } = useWindowSize();
  const { id } = useParams();
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [updateModalOpened, setUpdateModalOpened] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<B2BSalesPerson | null>(null);

  useEffect(() => {
    // fetchCompanies();
  }, []);

  const onPersonCreate = (values: B2BSalesPerson) => {
    createPerson({
      body: { ...values, accountId: id },
      actions: {
        onFinish: () => {
          onCreateModalClose();
          onRequestFinish();
        },
      },
    });
  };

  const onPersonUpdate = (values: B2BSalesPerson) => {
    updatePerson({
      body: { ...values, personId: selectedPerson?.id },
      actions: {
        onFinish: () => {
          onUpdateModalClose();
          onRequestFinish();
        },
      },
    });
  };

  const onPersonDelete = (id: string | number) => {
    deletePerson({
      body: { personId: id },
      actions: {
        onFinish: () => {
          onRequestFinish();
        },
      },
    });
  };

  const onCreateModalOpen = () => setCreateModalOpened(true);
  const onCreateModalClose = () => setCreateModalOpened(false);
  const onUpdateModalOpen = () => setUpdateModalOpened(true);
  const onUpdateModalClose = () => {
    setUpdateModalOpened(false);
    setSelectedPerson(null);
  };

  const onPersonClick = (person: B2BSalesPerson) => {
    setSelectedPerson(person);
    onUpdateModalOpen();
  };

  const renderTableHeaders = () => (
    <TableRow isHeader>
      {HEADERS.map((header) => (
        <TableItem textAlign="center" isHeader key={header.label}>
          {header.label}
        </TableItem>
      ))}
    </TableRow>
  );

  const renderTablePersons = () =>
    salesPersons?.map((person: B2BSalesPerson) => (
      <TableRow key={person.id}>
        <TableItem>{fullName(person)}</TableItem>
        <TableItem>
          <Image style={{ width: 100, height: 100 }} src={`${BASE_URL}images/${person.photoUrl}`} />
        </TableItem>
        <TableItem>{person.email}</TableItem>
        <TableItem>{person.phoneNo}</TableItem>
        {/*<TableItem as={FlexCenteredColumn}>*/}
        {/*  <Button onClick={() => onPersonClick(person)} style={{ marginBottom: 15, width: 150 }}>*/}
        {/*    Modifier*/}
        {/*  </Button>*/}
        {/*  <Button onClick={() => onPersonDelete(person.id)} style={{ width: 150 }} color="red">*/}
        {/*    Supprimer*/}
        {/*  </Button>*/}
        {/*</TableItem>*/}
      </TableRow>
    ));
  return (
    <Wrapper>
      <Title>
        {/*<Button*/}
        {/*  onClick={onCreateModalOpen}*/}
        {/*  style={{ width: 'fit-content', padding: '10px 20px' }}*/}
        {/*  color="pink"*/}
        {/*>*/}
        {/*  Créer un référent*/}
        {/*</Button>*/}
      </Title>
      {renderTableHeaders()}
      {renderTablePersons()}
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
            fields={['firstName', 'lastName', 'email', 'phoneNo']}
            labels={{
              email:
                'E-mail référent (client / bibliothèque) donne accès aux statistiques pour le client',
            }}
            onSubmit={onPersonCreate}
            submitLabel="Créer un référent"
          />
        </ModalBody>
      </Modal>
      <Modal
        ariaHideApp={false}
        isOpened={updateModalOpened}
        style={modalStyle(width)}
        onClose={onUpdateModalClose}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <ModalBody>
          <CreateAccountForm
            fields={['firstName', 'lastName', 'email', 'phoneNo']}
            defaultValues={selectedPerson}
            onSubmit={onPersonUpdate}
            submitLabel="Sauvegarder les modifications"
          />
        </ModalBody>
      </Modal>
    </Wrapper>
  );
}

export default SalesPersons;
