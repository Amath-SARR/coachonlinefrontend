/**
 *
 * LibrarySubscription
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { LibrarySubscriptionProps } from './index.props';
import { colors } from '../../../utils/colors';
import useWindowSize from '../../../hooks/useWindowSize';
import Modal from '../../Modal';
import Button from '../../Button';
import { localizeCurrency, localizeDate } from '../../../utils/localize';
import { B2BCompanyService } from '../../../containers/Libraries/reducer.types';
import { DataRow, Label, Value } from '../../LibraryStatistics';
import { modalStyles } from '../../../global-styles';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  @media screen and (max-width: 600px) {
    padding: 0;
  }
`;
const Column = styled.div`
  flex: 1;
  padding: 10px 15px;
  @media screen and (max-width: 1024px) {
    padding: 10px 0;
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
const Text = styled(Title)`
  font-weight: 500;
  font-size: 22px;
  color: ${colors.white};
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
  //min-width: 500px;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const InfoRow = styled(DataRow)`
  padding: 7px 0;
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
const HEADERS = (inUse: boolean) => {
  let baseHeaders = [
    {
      label: 'Nom',
    },
    {
      label: 'Période',
    },
    {
      label: "Nombre d'utilisateurs actifs",
    },
    {
      label: 'Comision',
    },
  ];
  if (inUse) {
    baseHeaders = baseHeaders.concat([
      {
        label: 'Actif depuis',
      },
      {
        label: 'Valable jusque',
      },
      {
        label: 'Statut',
      },
    ]);
  }
  return baseHeaders;
};

function LibrarySubscription(props: LibrarySubscriptionProps) {
  const { id } = useParams();
  const { library, services, onServiceSelect, onServiceCancel, canModify } = props;
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const selectSubscription = (subscription: B2BCompanyService) => {
    onServiceSelect(subscription);
  };

  const cancelSubscription = () => {
    onServiceCancel(lastSubscriptionInfo());
  };

  const onItemClick = (subscription: B2BCompanyService) => {
    selectSubscription(subscription);
    onCreateModalClose();
  };

  const onCreateModalOpen = () => setCreateModalOpened(true);
  const onCreateModalClose = () => setCreateModalOpened(false);

  const lastSubscriptionInfo = (): B2BCompanyService | null =>
    library?.allSubscriptions?.[library?.allSubscriptions?.length - 1] || null;

  const Subscription = (props: {
    item: B2BCompanyService;
    onClick?: (item: B2BCompanyService) => void;
  }) => {
    const { item, onClick } = props;
    return (
      <TableRow key={item.serviceId} onClick={() => (onClick ? onClick(item) : onItemClick(item))}>
        <TableItem>{item.pricingName}</TableItem>
        <TableItem>{item.timePeriodStr}</TableItem>
        <TableItem>{item.numberOfActiveUsers}</TableItem>
        {!!item.statusStr && <TableItem>{localizeCurrency(item.comission || 0)}</TableItem>}
        {!!item.statusStr && <TableItem>{localizeDate(item.subscriptionStart)}</TableItem>}
        {!!item.statusStr && <TableItem>{localizeDate(item.subscriptionEnd)}</TableItem>}
        {!!item.statusStr && <TableItem>{item.statusStr}</TableItem>}
        {/*<TableItem>*/}
        {/*  <div style={{ minHeight: 50 }}>*/}
        {/*    {!!item.statusStr && item.statusStr !== 'CANCELLED' && (*/}
        {/*      <DeleteAccount label="Annuler" onDelete={() => cancelSubscription(item)} />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</TableItem>*/}
      </TableRow>
    );
  };
  const renderTableHeaders = (inUse: boolean) => (
    <TableRow isHeader>
      {HEADERS(inUse).map((header) => (
        <TableItem textAlign="center" isHeader key={header.label}>
          {header.label}
        </TableItem>
      ))}
    </TableRow>
  );

  const renderTableSubscriptions = () =>
    services?.map((subscription: B2BCompanyService) => (
      <Subscription key={subscription.serviceId} item={subscription} />
    ));

  const renderLibrarySubscription = () => (
    <Column>
      <InfoRow>
        <Label>Start date</Label>
        <Value>{localizeDate(lastSubscriptionInfo()?.subscriptionStart)}</Value>
      </InfoRow>
      <InfoRow>
        <Label>End date</Label>
        <Value>{localizeDate(lastSubscriptionInfo()?.subscriptionEnd)}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Type of Pack</Label>
        <Value>{lastSubscriptionInfo()?.accessTypeStr}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Number of accesses to subscribed digital resources</Label>
        <Value>{lastSubscriptionInfo()?.numberOfActiveUsers}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Statut</Label>
        <Value>{lastSubscriptionInfo()?.statusStr}</Value>
      </InfoRow>
    </Column>
  );

  return (
    <Wrapper>
      {loading && (
        <LoaderWrapper>
          <Loader type="Oval" color={colors.mainPink} height={30} width={30} />
        </LoaderWrapper>
      )}
      {!!lastSubscriptionInfo() ? (
        renderLibrarySubscription()
      ) : (
        <Text style={{ justifyContent: 'center' }}>L'abonnement n'est pas sélectionné</Text>
      )}
      {canModify && (
        <InfoRow>
          <Button
            onClick={onCreateModalOpen}
            style={{ width: 'fit-content', padding: '10px 20px', margin: '10px auto' }}
            color="green"
          >
            Modifier l'abonnement
          </Button>
          {!!lastSubscriptionInfo() && (
            <Button
              onClick={cancelSubscription}
              style={{ width: 'fit-content', padding: '10px 20px', margin: '10px auto' }}
              outline
              color="green"
            >
              Supprimer l'abonnement
            </Button>
          )}
        </InfoRow>
      )}
      <Modal
        ariaHideApp={false}
        isOpened={createModalOpened}
        style={modalStyles(width)}
        onClose={onCreateModalClose}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <ModalBody>
          {renderTableHeaders(false)}
          {renderTableSubscriptions()}
        </ModalBody>
      </Modal>
    </Wrapper>
  );
}

export default LibrarySubscription;
