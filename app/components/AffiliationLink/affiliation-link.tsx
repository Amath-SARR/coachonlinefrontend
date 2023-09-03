/**
 *
 * AffiliationLink
 *
 */

import React, { useEffect, useState } from 'react';
import AffiliationLinkProps from './affiliation-link.props';
import styled from 'styled-components';
import ShareableLink from '../SharebaleLink';
import Label from '../Label';
import { colors } from '../../utils/colors';
import Input from '../Input';
import Button from '../Button';
import CheckBox from '../CheckBox';
import SelectInput from '../SelectInput';
import { localizeCurrency } from '../../utils/localize';
import { AffiliatorType, Coupon, RankingTypes } from '../../containers/Affiliation/reducer.types';
import { FlexColumn, FlexRow } from '../../global-styles';
import AffiliationText from '../AffiliationText/affiliation-text'


const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 2px solid ${(props) => props.accent};
  border-radius: 10px;
`;
const Link = styled(Input)`
  margin: 0;
`;
const LinkWrapper = styled.div`
  background-color: ${(props: { dark: boolean }) =>
    props.dark ? colors.inputBlue : colors.primaryBackgroundLight};
  width: 100%;
  border-radius: 10px;
  display: flex;
  padding: 5px 10px;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;
const Row = styled(FlexRow)`
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
`;
const Column = styled(FlexColumn)``;

const OptionsWrapper = styled.div``;




const inputStyle = (dark: boolean, accent = colors.mainGreen) => ({
  backgroundColor: colors.primaryBackgroundLight,
  color: accent,
  padding: '5px',
  fontSize: 16,
  border: 'none',
});

export const getLinkEditablePart = (link: string) => {
  const linkArray = link?.split('/');
  const apiPart = linkArray?.slice(0, linkArray?.length - 1);
  const editablePart = linkArray?.slice(linkArray?.length - 1)?.join('');
  return editablePart;
};

export const noCouponOption = { label: 'No coupon', value: null };

export const mapCoupon = (coupon: Coupon) => ({
  label: `${coupon.name} (${
    !!coupon.percentOff ? `${coupon.percentOff}%` : localizeCurrency(coupon.amountOff)
  } de réduction)`,
  value: coupon.id,
});

function AffiliationLink(props: AffiliationLinkProps) {
  const {
    link,
    label,
    dark = true,
    wrapperStyle,
    onLinkChange,
    onLinkOptionsChange,
    accent = colors.mainGreen,
    optionsAvailable = false,
    coupons,
    options: linkOptions,
    labelStyle = {},
    affiliatorType,
    text, 
  

  } = props;
  const [linkEditablePart, setLinkEditablePart] = useState('');
  const [editedLink, setEditedLink] = useState('');
  const [canSaveChanges, setCanSaveChanges] = useState(false);
  const [options, setOptions] = useState<{
    limitedPageView: boolean;
    couponId: string | null;
    withTrialPlans: boolean;
  }>({
    limitedPageView: linkOptions?.limitedPageView,
    couponId: linkOptions?.couponId,
    withTrialPlans: linkOptions?.withTrialPlans,
  });
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  useEffect(() => {
    sliceLink(link);
  }, [link]);

  const sliceLink = (link: string) => {
    const editablePart = getLinkEditablePart(link);
    setLinkEditablePart(editablePart);
    setEditedLink(editablePart);
    setCanSaveChanges(false);
  };

  const onChange = (link: string) => {
    setEditedLink(link);
    setCanSaveChanges(link !== linkEditablePart);
  };

  const changeLink = () => {
    if (!!onLinkChange) {
      onLinkChange(editedLink);
    }
  };

  const saveLinkOptions = () => {
    console.log(options, linkOptions);
    if (!!onLinkOptionsChange) {
      onLinkOptionsChange(options);
    }
  };

  const changeOption = (key: string, value: any) => {
    const changedOptions = { ...options, [key]: value };
    setOptions(changedOptions);
    setSaveButtonActive(shouldActivateSaveButton(changedOptions));
  };

  const shouldActivateSaveButton = (changedOptions) => {
    const changedValues = Object.keys(changedOptions).filter(
      (key) => changedOptions[key] !== linkOptions[key],
    );
    return changedValues.length > 0;
  };

  return (
    <Wrapper accent={accent} style={wrapperStyle}>
      <Label style={{ fontSize: 20, fontWeight: 600, ...labelStyle }}  label={label} />
      <AffiliationText text={text} />
      <ShareableLink accent={accent}  link={link} />
      {!!onLinkChange && (
        <LinkWrapper>
          <Link
            style={{ margin: 0 }}
            inputProps={{
              value: editedLink,
              onChange: (ev) => onChange(ev.target?.value),
              style: inputStyle(dark, accent)
            }}
          />
          <Button
            disableOnFetch
            disabled={!canSaveChanges}
            style={{ width: 'fit-content' }}
            color={accent}
            onClick={changeLink}
          >
            Sauvegarder
          </Button>
        </LinkWrapper>
      )}
      {optionsAvailable && (
        <OptionsWrapper>
          <Row>
            <Column>
              <CheckBox
                label={
                  "Cochez cette case pour ne pas montrer à votre public la page d'atterrissage complète. Seul le formulaire d'inscription sera affiché"
                }
                checked={options.limitedPageView}
                onChange={(val: boolean) => changeOption('limitedPageView', val)}
                style={{ margin: '10px 0' }}
                labelStyle={{ color: colors.black }}
                dark={dark}
              />
              {affiliatorType === AffiliatorType.Regular && (
                <CheckBox
                  label={
                    "Si vous sélectionnez cette option, les utilisateurs utilisant votre lien de parrainage recevront une promotion qui leur permettra de faire un essai sans payer d'abonnement. La durée de la période d'essai dépend des promotions en cours. Habituellement, elle est de 3 jours"
                  }
                  checked={options.withTrialPlans}
                  onChange={(val: boolean) => changeOption('withTrialPlans', val)}
                  style={{ margin: '10px 0' }}
                  labelStyle={{ color: colors.black }}
                  dark={dark}
                />
              )}
            </Column>
            <Button
              disableOnFetch
              disabled={!saveButtonActive}
              style={{ width: '100%', wordBreak: 'keep-all' }}
              color={accent}
              onClick={saveLinkOptions}
            >
              Sauvegarder les options
            </Button>
          </Row>

          {affiliatorType === AffiliatorType.Influencer && (
            <SelectInput
              redesigned={dark}
              colorScheme={dark ? 'dark' : 'light'}
              defaultValue2={linkOptions?.coupon ? mapCoupon(linkOptions?.coupon) : noCouponOption}
              options={coupons}
              onChange={(data) => changeOption('couponId', data.value)}
            />
          )}
        </OptionsWrapper>
      )}
    </Wrapper>
  );
}

export default AffiliationLink;
