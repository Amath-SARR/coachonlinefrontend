/**
 *
 * Students
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { compose, Dispatch } from '@reduxjs/toolkit';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { FlexColumn } from '../../../global-styles';
import { Contract } from '../../../store/contracts/contracts.types';
import { getLatestContractOfType } from '../../../store/contracts/contracts.slice';
import makeSelectContracts from '../../../store/contracts/contracts.selectors';
import { colors } from '../../../utils/colors';
import WysiwygConsumer from '../../../components/WysiwygConsumer/wysiwyg-consumer';
import PageContainer from '../../../components/PageContainer';
import Input from '../../../components/Input';

const Wrapper = styled.div``;
const WysiwygWrapper = styled(FlexColumn)`
  flex: 5;
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;
export const Title = styled.h2`
  margin-bottom: 30px;
  padding-bottom: 15px;
  width: fit-content;
  color: ${colors.lilac};
  border-bottom: 3px solid ${colors.mainGreen};
  @media screen and (max-width: 1024px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;
export function Contracts({ getLatestContract }) {
  const { contractId } = useParams<{ contractId: string }>();
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [editorRefreshing, setEditorRefreshing] = useState(true);

  useEffect(() => {
    onContractChange();
  }, [contractId]);

  const onContractChange = () => {
    setEditorRefreshing(true);
    fetchLatestContractOfType();
  };

  const fetchLatestContractOfType = () => {
    getLatestContract({
      body: { type: contractId },
      actions: {
        onSuccess: (contract: Contract) => {
          console.log('Contract changed to', contract);
          setCurrentContract(contract);
          refreshEditor();
        },
        onError: (err) => console.log(err),
      },
    });
  };

  const refreshEditor = () => {
    setEditorRefreshing(true);
    setTimeout(() => setEditorRefreshing(false), 1000);
  };

  return (
    <Wrapper>
      <PageContainer colorScheme={'dark'} showNavBar>
        <WysiwygWrapper>
          {editorRefreshing && (
            <LoaderWrapper>
              <Loader type="Oval" color={colors.mainGreen} height={35} width={25} />
            </LoaderWrapper>
          )}
          {!editorRefreshing && (
            <>
              <Title>{currentContract?.contractName}</Title>
              <WysiwygConsumer html={currentContract?.contractBody} />
            </>
          )}
        </WysiwygWrapper>
      </PageContainer>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  contracts: makeSelectContracts(),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch,
    getLatestContract: (data) => dispatch(getLatestContractOfType(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Contracts);
