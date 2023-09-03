/**
 *
 * AffiliationLink
 *
 */

import React, { useEffect, useState } from 'react';
import PayoutsButtonProps from './payouts-button.props';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import Button from '../Button';
import Modal from '../Modal';
import Payouts from '../Payouts/payouts';
import { compose } from '@reduxjs/toolkit';
import { createStructuredSelector } from 'reselect';
import makeSelectAffiliation from '../../containers/Affiliation/selectors';
import makeSelectAuth from '../../containers/Auth/selectors';
import { connect } from 'react-redux';
import { getPayoutsAction } from '../../containers/Affiliation/actions';
import { DispatchType } from '../../types';
import { authModalStyles } from '../../containers/Auth';
import useWindowSize from '../../hooks/useWindowSize';

const StyledButton = styled(Button)`
  font-size: 18px;
  font-weight: 500;
  min-width: 260px;
  max-width: 350px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
const modalStyle = (width: number) => ({
  ...authModalStyles(width),
  content: {
    ...authModalStyles(width).content,
    minHeight: '500px',
    maxWidth: '1600px',
    width: '100%',
  },
});

function PayoutsButton(props: PayoutsButtonProps) {
  const { width } = useWindowSize();
  const { userId, lastUpdateDate, dark = true, getPayouts = () => null } = props;
  const [payoutsModalOpened, setPayoutsModalOpened] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, [lastUpdateDate]);

  const fetchPayouts = () => {
    setLoading(true);
    getPayouts({
      body: { userId },
      actions: {
        onSuccess: (data) => setPayouts(data.reverse()),
        onFetchEnd: () => setLoading(false),
      },
    });
  };

  const onPayoutsModalOpened = () => {
    setPayoutsModalOpened(true);
  };

  const onPayoutsModalClosed = () => {
    setPayoutsModalOpened(false);
  };

  return (
    <>
      <StyledButton
        color={dark ? 'green' : 'pink'}
        textColor={colors.mainPink}
        spinnerColor={dark ? colors.mainGreen : colors.white}
        onClick={onPayoutsModalOpened}
        isLoading={loading}
        outline={dark}
        disabled={loading}
        style={{ marginTop: 10, background: 'transparent' }}
      >
        VOIR MES PAIEMENTS
      </StyledButton>
      <Modal
        ariaHideApp={false}
        isOpened={payoutsModalOpened}
        style={modalStyle(width)}
        onClose={onPayoutsModalClosed}
        overlayClassName="transition"
        withHeader
        backButtonHidden
      >
        <Payouts loading={loading} payouts={payouts} />
      </Modal>
    </>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getPayouts: (data) => dispatch(getPayoutsAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  affiliation: makeSelectAffiliation(),
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PayoutsButton);
