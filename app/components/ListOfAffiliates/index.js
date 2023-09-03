/**
 *
 * ListOfAffiliates
 *
 */

import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { fullName } from '../../utils/formatters';
import Affiliate from './affiliate';
import Input from '../Input';
import { localizeCurrency } from '../../utils/localize';
import Button from '../Button';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
  @media screen and (max-width: 600px) {
    padding: 0;
    //max-width: 250px;
    //overflow: scroll;
  }
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) => !props.isHeader && colors.backgroundBlue};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: fit-content;
  width: 100%;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`;
const TableItem = styled.div`
  min-width: 50px;
  width: calc(100% / 6);
  font-size: 12px;
  font-weight: ${(props) => (props.isHeader ? 600 : 300)};
  color: ${colors.white};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 5px;
`;

const Sum = styled.span`
  color: ${(props) => props.color || colors.white};
  padding: 0 5px;
`;

function ListOfAffiliates({ affiliates, loading, dark, onGenerateAffiliatesFile }) {
  const [affiliatesList, setAffiliatesList] = useState(affiliates);
  const [searchValue, setSearchValue] = useState('');

  const filter = (value) => {
    setSearchValue(value);
    const filteredItems = value
      ? affiliates?.filter(
        (item) =>
          fullName(item).trim()?.toLowerCase().includes(value.toLowerCase()) ||
            item.email?.toLowerCase().includes(value.toLowerCase()),
      )
      : affiliates;
    setAffiliatesList(filteredItems);
  };

  const Affiliates = () =>
    affiliatesList?.map((user, index) => <Affiliate dark={dark} user={user} index={index} />) ||
    null;

  const sumIncomes = () =>
    affiliates?.reduce(
      (acc, current) => {
        acc.income += current.earnedMoney;
        acc.potentialIncome += current.potentialYearlyIncome;
        current.affiliates?.forEach((user) => {
          acc.income += user.earnedMoney;
          acc.potentialIncome += user.potentialYearlyIncome;
        });
        return acc;
      },
      { income: 0, potentialIncome: 0 },
    );

  const sumOfIncomes = sumIncomes();

  return (
    <Wrapper>
      {loading && (
        <LoaderWrapper visible={loading}>
          <Loader type="Oval" color="grey" height={30} width={30} />
        </LoaderWrapper>
      )}
      <TableRow>
        <Input
          redesigned
          inputProps={{
            onChange: (ev) => filter(ev.target.value),
            value: searchValue,
            style: { maxWidth: '200px' },
          }}
          label={'Recherche'}
          type="text"
        />
        <TableRow style={{ justifyContent: 'flex-end' }}>
          <Sum>Total des revenus actuels</Sum>
          <Sum color={colors.mainGreen}>{localizeCurrency(sumOfIncomes.income.toFixed(2))}</Sum>
          <Sum>Total des revenus potentiels</Sum>
          <Sum color={colors.mainGold}>
            {localizeCurrency(sumOfIncomes.potentialIncome.toFixed(2))}
          </Sum>
        </TableRow>
        <Button
          onClick={onGenerateAffiliatesFile}
          showLoader
          color={'green'}
          style={{ width: 'fit-content', wordBreak: 'keep-all' }}
        >
          Generate XLSX
        </Button>
      </TableRow>
      <Affiliates />
    </Wrapper>
  );
}

export default ListOfAffiliates;
