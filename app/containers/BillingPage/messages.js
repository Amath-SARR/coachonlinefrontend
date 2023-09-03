/*
 * BillingPage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.BillingPage';

export default defineMessages({
  companyName: {
    id: `${scope}.companyName`,
    defaultMessage: 'COMPANY NAME',
  },
  city: {
    id: `${scope}.city`,
    defaultMessage: 'CITY',
  },
  siretNumber: {
    id: `${scope}.siretNumber`,
    defaultMessage: "NUMÉRO D'ENTREPRISE (SIRET, NEQ, KRS ETC.)",
  },
  bankAccountNumber: {
    id: `${scope}.bankAccountNumber`,
    defaultMessage: 'BANK ACCOUNT NUMBER',
  },
  companyRegistrationAddress: {
    id: `${scope}.companyRegistrationAddress`,
    defaultMessage: 'COMPANY REG. ADDRESS',
  },
  country: {
    id: `${scope}.country`,
    defaultMessage: 'COUNTRY',
  },
  postCode: {
    id: `${scope}.postCode`,
    defaultMessage: 'POST CODE',
  },
  vatNumber: {
    id: `${scope}.vatNumber`,
    defaultMessage: 'VAT NUMBER',
  },
  bicNumber: {
    id: `${scope}.bicNumber`,
    defaultMessage: 'NUMÉRO BIC',
  },
  stripeAccountDisclaimer: {
    id: `${scope}.stripeAccountDisclaimer`,
    defaultMessage:
      'To be able to payout you need to have an registered and verified Stripe account. Please, follow the instructions.',
  },
  paypalAccountDisclaimer: {
    id: `${scope}.paypalAccountDisclaimer`,
    defaultMessage:
      'Pas encore de compte PayPal ? Cliquez sur le bouton ci dessous pour en créer un et recevoir vos gains. ',
  },
  verifiedInPaypalAs: {
    id: `${scope}.verifiedInPaypalAs`,
    defaultMessage:
      'Vous êtes vérifié dans Paypal et pouvez effectuer des retraits maintenant en tant que : ',
  },
  notYou: {
    id: `${scope}.notYou`,
    defaultMessage: ' Pas vous ?',
  },
  // stripe statuses
  stripeStatus: {
    id: `${scope}.stripeStatus`,
    defaultMessage: 'STRIPE STATUTS',
  },
  status0: {
    id: `${scope}.status0`,
    defaultMessage: 'NO ACCOUNT',
  },
  status1: {
    id: `${scope}.status1`,
    defaultMessage: 'ACCOUNT NOT VERIFIED',
  },
  status2: {
    id: `${scope}.status2`,
    defaultMessage: 'KYC NOT VERIFIED',
  },
  status3: {
    id: `${scope}.status3`,
    defaultMessage: 'VERIFIED',
  },
  createStripeAccount: {
    id: `${scope}.createStripeAccount`,
    defaultMessage: 'CREATE STRIPE ACCOUNT',
  },
  verifyStripeAccount: {
    id: `${scope}.verifyStripeAccount`,
    defaultMessage: 'VERIFY STRIPE ACCOUNT',
  },
  verifyStripeKYC: {
    id: `${scope}.verifyStripeKYC`,
    defaultMessage: 'VERIFY KYC INFORMATION',
  },
  yourBalance: {
    id: `${scope}.yourBalance`,
    defaultMessage: 'YOUR BALANCE',
  },
  payout: {
    id: `${scope}.payout`,
    defaultMessage: 'PAYOUT',
  },
});
