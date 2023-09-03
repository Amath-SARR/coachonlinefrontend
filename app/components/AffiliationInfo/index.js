/**
 *
 * AffiliationInfo
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Category } from '../CategorySelector';
import { colors } from '../../utils/colors';
import { FlexCenteredColumn, FlexRow } from '../../global-styles';
import Button from '../Button';
import Input from '../Input';
import {
  changeCoachLinkAction,
  changeLinkAction,
  changeLinkOptionsAction,
  generateCoachLinkAction,
  generateLinkAction,
  getAffiliatesAction,
  getAffiliatesFileAction,
  getCoachLinkAction,
  getCouponsAction,
  getEarningsAction,
  getEarningsForPeriodAction,
  getLinkAction,
  getLinkOptionsAction,
  getPayoutsAction,
  getPeriodicEarningsAction,
  withdrawAffiliationEarningsAction,
} from '../../containers/Affiliation/actions';
import makeSelectAffiliation from '../../containers/Affiliation/selectors';
import { localizeCurrency } from '../../utils/localize';
import Modal from '../Modal';
import { authModalStyles } from '../../containers/Auth';
import useWindowSize from '../../hooks/useWindowSize';
import ListOfAffiliates from '../ListOfAffiliates';
import PeopleGreenImg from '../../images/icons/people--green.svg';
import PeopleWhiteImg from '../../images/icons/people.svg';
import Paypal from '../Paypal';
import { APPLICATION_URL } from '../../config/env';
import makeSelectAuth from '../../containers/Auth/selectors';
import DatePeriodSelector from '../DatePeriodSelector';
import AffiliationLink, {
  getLinkEditablePart,
  mapCoupon,
  noCouponOption,
} from '../AffiliationLink/affiliation-link';
import Payouts from '../Payouts/payouts';
import PayoutsButton from '../PayoutsButton/payouts-button';

const Wrapper = styled.div`
  max-width: 600px;
  margin: auto;
`;

const Column = styled(FlexCenteredColumn)`
  margin-bottom: 20px;
`;
const Balance = styled(Category)`
  background: ${(props) => (props.dark ? colors.mainGreen : colors.mainPink)};
  width: 200px;
  text-align: center;
  border-radius: 10px;
  border: none;
  color: ${(props) => (props.dark ? colors.black : colors.white)};
  font-size: 36px;
  font-weight: 600;
  padding: 10px 20px 5px 20px;
  word-break: break-word;
  margin: 0 0 15px 0;
  cursor: unset;
`;
const EarningsWrapper = styled(Column)`
  background-color: ${(props) => (props.dark ? colors.inputBlue : colors.primaryBackgroundLight)};
  padding: 20px;
  border-radius: 10px;
`;
const Row = styled(FlexRow)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Text = styled.p`
  color: black;
  margin-bottom: 15px;
  font-size: 21px;
  @media screen and (max-width: 920px) {
    font-size: 17px;
  }
`;
const ValueDescription = styled(Text)`
  margin: 0;
  color: ${(props) => (props.dark ? colors.white : colors.black)};
  font-weight: 600;
  font-size: 17px;
  @media screen and (max-width: 920px) {
    font-size: 13px;
  }
`;
const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) => !props.isHeader && colors.primaryBackgroundLight};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: 500px;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const TableItem = styled.div`
  min-width: 100px;
  width: calc(100% / 6);
  font-size: 13px;
  font-weight: ${(props) => (props.isHeader ? 600 : 500)};
  color: ${colors.lilac};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 5px;
`;
const Value = styled.p`
  color: ${(props) => (props.dark ? colors.mainGreen : colors.mainPink)};
  font-size: 31px;
  font-weight: 700;
  margin: 0 10px;
  @media screen and (max-width: 920px) {
    font-size: 21px;
  }
`;
const Link = styled(Input)`
  margin: 0;
`;
const LinkWrapper = styled.div`
  background-color: ${(props) => (props.dark ? colors.inputBlue : colors.primaryBackgroundLight)};
  width: 100%;
  border-radius: 10px;
  display: flex;
  padding: 5px 10px;
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  font-weight: 500;
  width: 270px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  padding: 4px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
  filter: ${({ dark }) => (dark ? '' : 'invert(1)')};
`;

const modalStyle = (width) => ({
  ...authModalStyles(width),
  content: {
    ...authModalStyles(width).content,
    minHeight: '500px',
    maxWidth: '1600px',
    width: '100%',
    background: 'white',
  },
});

const HEADERS = [
  {
    label: '',
  },
  {
    label: 'Date',
  },
  {
    label: 'Nom',
  },
  {
    label: 'E-mail',
  },
  {
    label: "Type d'utilisateur",
  },
  {
    label: "Plan d'abonnement",
  },
  {
    label: "Motif d'annulation de l'abonament",
  },
  {
    label: 'Revenus annuel potentiel',
  },
  {
    label: 'Revenus',
  },
  {
    label: 'Date du prochain revenu potentiel',
  },
  {
    label: 'Votre commission',
  },
  {
    label: '',
  },
];

function AffiliationInfo({
  affiliation,
  generateLink,
  generateCoachLink,
  getLink,
  getCoachLink,
  getEarnings,
  getPeriodicEarnings,
  getEarningsForPeriod,
  changeLink,
  changeCoachLink,
  getAffiliates,
  withPayPal,
  withdraw,
  dark,
  auth,
  accent,
  getLinkOptions,
  getCoupons,
  changeLinkOptions,
  getAffiliatesFile,
  getPayouts,
}) {
  const { width } = useWindowSize();
  const [affiliatesModalOpened, setAffiliatesModalOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payoutsUpdateDate, setPayoutsUpdateDate] = useState(Date.now());
  const isPies = auth.userInfo?.userRole === 'COACH'; // ;)
  const userData = isPies ? auth.userDataFetched : auth.studentData;

  useEffect(() => {
    getAffiliationData();
  }, []);

  useEffect(() => {
    fetchLinkOptions();
  }, [affiliation.link]);

  const getAffiliationData = () => {
    getLink();
    fetchCoachLink();
    fetchCoupons();
    getEarnings();
    getPeriodicEarnings();
    getAffiliates({ onFinish: () => setLoading(false) });
  };

  const fetchCoupons = () => {
    getCoupons({ body: { userId: userData.userId } });
  };

  const fetchLinkOptions = () => {
    if (!!affiliation.link) {
      getLinkOptions({
        body: { userId: userData.userId, link: getLinkEditablePart(affiliation.link) },
      });
    }
  };

  const fetchCoachLink = () => {
    getCoachLink({ body: { userId: userData.userId } });
  };

  const createLink = () => {
    generateLink({ onFinish: () => getLink() });
  };

  const createCoachLink = () => {
    generateCoachLink({
      body: { userId: userData.userId },
      actions: { onFinish: () => fetchCoachLink() },
    });
  };

  const generateAffiliatesFile = () => {
    getAffiliatesFile({ body: { userId: userData.userId } });
  };

  const onAffiliatesModalOpened = () => {
    setAffiliatesModalOpened(true);
  };

  const onAffiliatesModalClosed = () => {
    setAffiliatesModalOpened(false);
  };

  const sumAffiliates = (affiliates = []) =>
    affiliates.reduce(
      (accumulator, current) => {
        accumulator.total += current?.total || 0;
        accumulator.toWithdraw += current?.toWithdraw || 0;
        accumulator.withdrawn += current?.withdrawn || 0;
        return accumulator;
      },
      { total: 0, toWithdraw: 0, withdrawn: 0, currency: 'eur' },
    );

  const convertAmount = (amount = 0, currency = 'eur') => localizeCurrency(amount, currency);

  const getAmount = (valuesToSum, key = 'total') => {
    const sum = sumAffiliates(valuesToSum || []);
    return convertAmount(sum[key], sum.currency);
  };

  const onDateChange = (data) => {
    console.log('Date changed', data);
    getEarningsForPeriod(data);
  };

  const onWithdraw = () => {
    withdraw({
      onFinish: () => {
        getAffiliationData();
        setPayoutsUpdateDate(Date.now());
      },
    });
  };

  const onLinkChange = (link) => {
    changeLink({ body: { link, userId: userData.userId }, actions: { onFinish: () => getLink() } });
  };

  const onLinkOptionsChange = (options) => {
    changeLinkOptions({
      body: { userId: userData.userId, link: getLinkEditablePart(affiliation.link), ...options },
      actions: {
        onSuccess: () => toast.success('Le compte a été modifié avec succès'),
        onFetchEnd: () => {
          fetchLinkOptions();
        },
      },
    });
  };

  const onCoachLinkChange = (link) => {
    changeCoachLink({
      body: { link, userId: userData.userId },
      actions: { onFetchEnd: fetchCoachLink },
    });
  };

  const ListOfAffiliatesHeaders = () => (
    <TableRow isHeader>
      {HEADERS.map((header, index) => (
        <TableItem textAlign="center" isHeader key={index}>
          {header.label}
        </TableItem>
      ))}
    </TableRow>
  );

  return (
    <Wrapper>
      <Column>
        <Text>Solde actuel</Text>
        <Balance>{getAmount(affiliation.totalEarnings, 'toWithdraw')}</Balance>
        {withPayPal && (
          <Paypal
            notVerifiedMessage="Vous n'avez pas de compte connecté à PayPal"
            onWithdraw={onWithdraw}
            paypalSetupProps={{
              returnurl: `${APPLICATION_URL}${
                auth.userInfo?.userRole === 'COACH'
                  ? 'profile/affiliation'
                  : 'studentProfile/affiliation'
              }`,
            }}
          />
        )}
      </Column>
      <EarningsWrapper>
        <Row>
          <ValueDescription>Revenus de cette semaine</ValueDescription>
          <Value>{getAmount(affiliation.currentWeekEarnings, 'total')}</Value>
        </Row>
        <Row>
          <ValueDescription>Revenus du mois</ValueDescription>
          <Value>{getAmount(affiliation.currentMonthEarnings, 'total')}</Value>
        </Row>
        <Row>
          <DatePeriodSelector
            onChange={(dates) => {
              const [startDate, endDate] = dates;
              onDateChange({ startDate, endDate });
            }}
          />
          <Value>{getAmount(affiliation.selectedPeriodEarnings, 'total')}</Value>
        </Row>
      </EarningsWrapper>
      <Column>
        {affiliation.link ? (
          <AffiliationLink
            optionsAvailable
            coupons={[
              noCouponOption,
              ...(affiliation.coupons || [])?.map((coupon) => mapCoupon(coupon)),
            ]}
            options={affiliation.linkOptions}
            wrapperStyle={{ marginBottom: 20 }}
            accent={colors.mainGreen}
            affiliatorType={userData.affiliatorType}
            label={'Lien de parrainage futurs abonnés'}
            link={affiliation.link}
            onLinkChange={onLinkChange}
            onLinkOptionsChange={onLinkOptionsChange}
            text={
              'Ceci est votre lien de parrainage, vous pouvez l’envoyer à tous les contacts que vous souhaitez pour leur recommander de s’abonner à Coachs Online ! '
            }
          />
        ) : (
          <StyledButton
            color={'green'}
            textColor={colors.black}
            spinnerColor={colors.mainGreen}
            onClick={createLink}
            isLoading={loading}
            outline={dark}
          >
            Générer un lien pour les etudiants
          </StyledButton>
        )}

        {affiliation.coachLink ? (
          <AffiliationLink
            wrapperStyle={{ marginBottom: 20 }}
            accent={colors.mainPink}
            label={'Lien de parrainage pour les coachs'}
            link={affiliation.coachLink}
            onLinkChange={onCoachLinkChange}
            text={
              'Ceci est votre lien de parrainage coachs, vous pouvez l’envoyer à tous les professionnels formateurs que vous connaissez pour leur recommander d’être présents sur la plateforme.'
            }
          />
        ) : (
          <StyledButton
            color={'pink'}
            textColor={colors.mainPink}
            spinnerColor={colors.mainPink}
            onClick={createCoachLink}
            isLoading={loading}
            outline={dark}
          >
            Générer un lien pour les coachs
          </StyledButton>
        )}
      </Column>
      <Column>
        <StyledButton
          color={dark ? 'green' : 'pink'}
          textColor={dark ? colors.mainGreen : colors.white}
          spinnerColor={dark ? colors.mainGreen : colors.white}
          onClick={onAffiliatesModalOpened}
          isLoading={loading}
          outline={dark}
          disabled={loading || !affiliation.affiliates?.length}
        >
          <IconWrapper>
            <Icon
              dark={dark}
              style={{ filter: 'none' }}
              src={dark ? PeopleGreenImg : PeopleWhiteImg}
            />
          </IconWrapper>
          Liste des parrainés
        </StyledButton>
      </Column>
      {/*<Column>*/}
      {/*  <AffiliationRankings dark={dark} accent={accent} />*/}
      {/*</Column>*/}
      <Modal
        ariaHideApp={false}
        isOpened={affiliatesModalOpened}
        style={modalStyle(width)}
        onClose={onAffiliatesModalClosed}
        overlayClassName="transition"
        fixedContent={<ListOfAffiliatesHeaders />}
        withHeader
        backButtonHidden
      >
        <ListOfAffiliates
          loading={loading}
          affiliates={affiliation.affiliates}
          onGenerateAffiliatesFile={generateAffiliatesFile}
        />
      </Modal>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    generateLink: (data) => dispatch(generateLinkAction(data)),
    generateCoachLink: (data) => dispatch(generateCoachLinkAction(data)),
    getLink: (data) => dispatch(getLinkAction(data)),
    getCoachLink: (data) => dispatch(getCoachLinkAction(data)),
    getEarnings: () => dispatch(getEarningsAction()),
    getPeriodicEarnings: () => dispatch(getPeriodicEarningsAction()),
    getEarningsForPeriod: (data) => dispatch(getEarningsForPeriodAction(data)),
    getAffiliates: (data) => dispatch(getAffiliatesAction(data)),
    changeLink: (data) => dispatch(changeLinkAction(data)),
    changeLinkOptions: (data) => dispatch(changeLinkOptionsAction(data)),
    changeCoachLink: (data) => dispatch(changeCoachLinkAction(data)),
    withdraw: (data) => dispatch(withdrawAffiliationEarningsAction(data)),
    getCoupons: (data) => dispatch(getCouponsAction(data)),
    getLinkOptions: (data) => dispatch(getLinkOptionsAction(data)),
    getAffiliatesFile: (data) => dispatch(getAffiliatesFileAction(data)),
    getPayouts: (data) => dispatch(getPayoutsAction(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  affiliation: makeSelectAffiliation(),
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AffiliationInfo);
