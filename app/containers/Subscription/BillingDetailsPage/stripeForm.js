import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../../utils/colors';
import { fullName } from '../../../utils/formatters';
import { FlexColumn, FlexRow, Text } from '../../../global-styles';
import Label from '../../../components/Label';

const Form = styled.form`
  width: 100%;
  position: relative;
  height: 300px;
`;

const CardFront = styled.div`
  width: 100%;
  max-width: 325px;
  height: 220px;
  background: linear-gradient(315deg, #2457db 0%, #259fb4 100%);
  border-radius: 10px;
  box-shadow: 10px 10px 30px ${colors.backgroundDarkBlue};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CardBack = styled(CardFront)`
  background: linear-gradient(135deg, #2457db 0%, #259fb4 100%);
  top: unset;
  left: unset;
  right: 0;
  bottom: 0;
  z-index: 0;
  padding: 15px 30px;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

const InputWrapper = styled.label`
  display: flex;
  flex-direction: column;
  color: ${colors.lilac};
  font-size: 10px;
  font-weight: 300;
  margin-bottom: 15px;
`;
const InputInnerWrapper = styled.div`
  background-color: ${colors.inputBlue};
  border-radius: 5px;
  padding: 10px;
`;
const CardText = styled(Text)``;
const Row = styled(FlexRow)`
  width: 100%;
`;
const Column = styled(FlexColumn)`
  flex: 1;
  position: relative;
  padding: 0 10px;
`;

const InputsStyle = {
  base: {
    width: '100%',
    fontSize: '14px',
    backgroundColor: colors.inputBlue,
    color: colors.lilac,
    borderRadius: '5px',
    // padding: '10px',
    outline: 'none',
    border: 'none',
    textAlign: 'left',
    fontWeight: 500,
    '::placeholder': {
      color: colors.lilac,
    },
  },
  empty: {
    color: colors.lilac,
  },
  invalid: {
    color: '#f98484',
  },
};
const StripeForm = ({
  passRef,
  setLoading,
  paymentIntent,
  billingDetails,
  clientSecret,
  onSuccess,
}) => {
  const formRef = useRef();
  const stripe = useStripe();
  const elements = useElements();
  const [cardInfo, setCardInfo] = useState({
    cardholderName: fullName(billingDetails),
    cardNo: '',
    validUntil: '',
    cvc: '',
  });

  useEffect(() => {
    passRef(formRef?.current);
  }, [formRef?.current]);

  const handlePayment = async (event) => {
    event.preventDefault();
    if (paymentIntent) {
      return onSuccess(paymentIntent);
    }

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
    }
    setLoading(true);
    stripe
      .confirmCardSetup(clientSecret, {
        payment_method: {
          // type: 'card',
          card: elements.getElement(CardNumberElement),
          billing_details: {
            address: {
              city: billingDetails?.city,
              country: billingDetails?.country?.value,
              line1: null,
              line2: null,
              postal_code: billingDetails?.postalCode,
              state: null,
            },
            email: billingDetails?.email,
            name: billingDetails.cardholderName,
            phone: null,
          },
        },
      })
      .then((response) => {
        if (response?.error) {
          throw response?.error;
        }
        onSuccess(response);
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e?.message);
      });
  };

  const onFieldChange = (fieldName, value) => setCardInfo({ ...cardInfo, [fieldName]: value });

  return (
    <div style={{ flex: 1, padding: '0 15px', width: '100%' }}>
      <Row>
        <Column>
          <Form ref={formRef} onSubmit={handlePayment}>
            <InputWrapper style={{}}>
              <Label label={'Cardholder Name'} />
              <InputInnerWrapper>
                <input
                  style={{ ...InputsStyle.base, textAlign: 'left' }}
                  id="name"
                  type="text"
                  placeholder="eg. Jon Doe*"
                  value={cardInfo.cardholderName}
                  onChange={(e) => onFieldChange('cardholderName', e.target.value)}
                />
              </InputInnerWrapper>
            </InputWrapper>
            <InputWrapper>
              <Label label={'Card number'} />
              <InputInnerWrapper>
                <CardNumberElement
                  options={{
                    style: {
                      ...InputsStyle,
                      base: {
                        ...InputsStyle.base,
                      },
                    },
                  }}
                  onReady={() => {
                    console.log('CardNumberElement [ready]');
                  }}
                  onChange={(event) => {
                    console.log('CardNumberElement [change]', event);
                  }}
                  onBlur={() => {
                    console.log('CardNumberElement [blur]');
                  }}
                  onFocus={() => {
                    console.log('CardNumberElement [focus]');
                  }}
                />
              </InputInnerWrapper>
            </InputWrapper>
            <InputWrapper style={{ textAlign: 'left' }}>
              <Label label={'Expiration date'} />
              <InputInnerWrapper>
                <CardExpiryElement
                  options={{
                    placeholder: 'MM/YY',
                    style: {
                      ...InputsStyle,
                    },
                  }}
                  onReady={() => {
                    console.log('CardNumberElement [ready]');
                  }}
                  onChange={(event) => {
                    console.log('CardNumberElement [change]', event);
                  }}
                  onBlur={() => {
                    console.log('CardNumberElement [blur]');
                  }}
                  onFocus={() => {
                    console.log('CardNumberElement [focus]');
                  }}
                />
              </InputInnerWrapper>
            </InputWrapper>
            <InputWrapper style={{ textAlign: 'left' }}>
              <Label label={'CVC'} />
              <InputInnerWrapper>
                <CardCvcElement
                  options={{
                    style: {
                      ...InputsStyle,
                    },
                  }}
                  onReady={() => {
                    console.log('CardNumberElement [ready]');
                  }}
                  onChange={(event) => {
                    console.log('CardNumberElement [change]', event);
                  }}
                  onBlur={() => {
                    console.log('CardNumberElement [blur]');
                  }}
                  onFocus={() => {
                    console.log('CardNumberElement [focus]');
                  }}
                />
              </InputInnerWrapper>
            </InputWrapper>
          </Form>
        </Column>
        {/*<Column>*/}
        {/*  <CardFront>*/}
        {/*    <Text>{cardInfo.cardholderName}</Text>*/}
        {/*    <Text>{cardInfo.cardNo}</Text>*/}
        {/*  </CardFront>*/}
        {/*  <CardBack>*/}
        {/*    <Text>{cardInfo.validUntil}</Text>*/}
        {/*    <Text>{cardInfo.cvc}</Text>*/}
        {/*  </CardBack>*/}
        {/*</Column>*/}
      </Row>
    </div>
  );
};

export default StripeForm;
