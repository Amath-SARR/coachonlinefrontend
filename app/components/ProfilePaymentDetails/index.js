/**
 *
 * ProfilePaymentDetails
 *
 */

import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import subscriptionMessages from '../../containers/Subscription/messages';
import makeSelectAuth from '../../containers/Auth/selectors';
import makeSelectSubscription from '../../containers/Subscription/selectors';
import Input from '../Input';
import { FlexColumn, FlexRow, TableItem, TableRow } from '../../global-styles';
import Button from '../Button';
import history from '../../utils/history';
import Modal from '../Modal';
import { authModalStyles } from '../../containers/Auth';
import { colors } from '../../utils/colors';
import useWindowSize from '../../hooks/useWindowSize';
import {
  deletePaymentMethodAction,
  setDefaultPaymentMethodAction,
} from '../../containers/Subscription/actions';

const Wrapper = styled(FlexColumn)``;
const ChangePaymentInfoButton = styled(Button)`
  width: fit-content;
  margin: 0 auto 15px auto;
`;
const modalStyle = (width) => ({
  ...authModalStyles(width),
  content: {
    ...authModalStyles(width).content,
    minHeight: '500px',
    maxWidth: '1000px',
    width: '100%',
  },
});

const HEADERS = [
  {
    label: 'Brand',
  },
  {
    label: 'Last 4 digits',
  },
  {
    label: 'Valid until',
  },
  {
    label: '',
  },
  {
    label: '',
  },
];

const CardsListHeaders = () => (
  <TableRow isHeader>
    {HEADERS.map((header, index) => (
      <TableItem textAlign="center" isDark isHeader key={index}>
        {header.label}
      </TableItem>
    ))}
  </TableRow>
);

const Card = (props) => {
  const { paymentMethod = {}, isUsed, onSetUsed, onDelete } = props;
  const { brand, last4Digits, validTo } = paymentMethod.card;
  return (
    <TableRow>
      <TableItem>{brand}</TableItem>
      <TableItem>**** **** **** {last4Digits}</TableItem>
      <TableItem>{validTo}</TableItem>
      <TableItem>
        {isUsed ? (
          <Button
            color={'green'}
            outline
            style={{ fontSize: 12, cursor: 'default' }}
            showLoader
            onClick={() => null}
          >
            Actuellement utilisé
          </Button>
        ) : (
          <Button
            color={'transparent'}
            style={{ fontSize: 12 }}
            showLoader
            onClick={() => onSetUsed(paymentMethod)}
          >
            Utilisez pour vos futurs paiements
          </Button>
        )}
      </TableItem>
      <TableItem>
        <Button
          color={'red'}
          style={{ fontSize: 10 }}
          showLoader
          onClick={() => onDelete(paymentMethod)}
        >
          Supprimer la carte
        </Button>
      </TableItem>
    </TableRow>
  );
};

const PaymentMethods = (props) => {
  const { methods = [], defaultMethod, onSetUsed, onDelete } = props;
  return methods.map((item) => {
    const isUsed = defaultMethod?.stripePaymentMethodId === item.stripePaymentMethodId;
    return <Card paymentMethod={item} isUsed={isUsed} onSetUsed={onSetUsed} onDelete={onDelete} />;
  });
};

function ProfilePaymentDetails({ auth, subscription, changeDefaultMethod, deleteMethod }) {
  const location = useLocation();
  const { width } = useWindowSize();
  const { paymentMethods, cardInfo } = subscription || {};
  const [cardNumber, setCardNumber] = useState(null);
  const [cardsListOpened, setCardsListOpened] = useState(false);

  useEffect(() => {
    console.log('Triggered');
    setCardNumber(
      subscription.cardInfo?.card?.last4Digits
        ? `**** **** **** ${cardInfo?.card?.last4Digits}`
        : "Aucune carte de paiement n'a été ajoutée",
    );
  }, [subscription.cardInfo]);

  const onCardsListOpen = () => setCardsListOpened(true);
  const onCardsListClose = () => setCardsListOpened(false);

  const onAddNewMethodClick = () => {
    history.push('/subscription/profileDetails', {
      background: location,
    });
  };

  const onDefaultMethodChange = (method) => {
    console.log(method);
    changeDefaultMethod({ setupIntent: { payment_method: method.stripePaymentMethodId } });
  };

  const onMethodDelete = (method) => {
    deleteMethod({ body: { methodId: method.stripePaymentMethodId } });
  };

  return (
    <Wrapper>
      <Input
        redesigned
        inputProps={{
          readOnly: true,
          value: cardNumber,
          placeholder: "Aucune carte de paiement n'a été ajoutée",
        }}
        labelName={subscriptionMessages.managePaymentInfo}
      />
      {paymentMethods.length ? (
        <Button showLoader color={'green'} onClick={onCardsListOpen}>
          Gérer les méthodes de paiement
        </Button>
      ) : (
        <ChangePaymentInfoButton showLoader color="green" onClick={onAddNewMethodClick}>
          Ajouter une nouvelle méthode de paiement
        </ChangePaymentInfoButton>
      )}
      <Modal
        ariaHideApp={false}
        isOpened={cardsListOpened}
        style={modalStyle(width)}
        onClose={onCardsListClose}
        fixedContent={<CardsListHeaders />}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <PaymentMethods
          methods={paymentMethods}
          onSetUsed={onDefaultMethodChange}
          onDelete={onMethodDelete}
          defaultMethod={cardInfo}
        />
        <ChangePaymentInfoButton showLoader color="green" onClick={onAddNewMethodClick}>
          Ajouter une nouvelle méthode de paiement
        </ChangePaymentInfoButton>
      </Modal>
    </Wrapper>
  );
}

ProfilePaymentDetails.propTypes = {};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  subscription: makeSelectSubscription(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeDefaultMethod: (data) => dispatch(setDefaultPaymentMethodAction(data)),
    deleteMethod: (data) => dispatch(deletePaymentMethodAction(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ProfilePaymentDetails);
