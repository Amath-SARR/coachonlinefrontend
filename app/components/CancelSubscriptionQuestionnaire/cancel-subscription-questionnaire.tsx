/**
 *
 * WelcomeQuestionnaire
 *
 */

import React, { SyntheticEvent, useEffect, useState } from 'react';
import CancelSubscriptionQuestionnaireProps from './cancel-subscription-questionnaire.props';
import styled from 'styled-components';
import { DispatchType, RequestActions } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import { authModalStyles } from '../../containers/Auth';
import RadioInput from '../RadioInput/radio-input';
import { QuestionnaireEventData, QuestionnaireResponse } from '../ConnectionsTrackerSignalR/types';
import { RadioInputOption } from '../RadioInput/radio-input.props';
import { answerToQuestionnaireAction, setQuestionnaireAction } from '../../containers/Auth/actions';
import Input from '../Input';
import Button from '../Button';
import makeSelectSubscription from '../../containers/Subscription/selectors';
import { toast } from 'react-toastify';
import { getCancelSubscriptionQuestionnaireAction } from '../../containers/Subscription/actions';
import Loader from 'react-loader-spinner';
import { colors } from '../../utils/colors';

const Wrapper = styled.div``;
const ModalInner = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const modalStyle = (width: number) => ({
  ...authModalStyles(width),
  content: {
    ...authModalStyles(width).content,
  },
});

function CancelSubscriptionQuestionnaire(props: CancelSubscriptionQuestionnaireProps) {
  const { width } = useWindowSize();
  const {
    subscription = {},
    getQuestionnaire = () => null,
    answerToQuestionnaire = () => null,
    resetQuestionnaire = () => null,
    onAnswerSubmit = () => null,
    questionnaireOpened: openedProp,
    onClose = () => null,
  } = props;

  const [questionnaireOpened, setQuestionnaireOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState({
    id: subscription?.questionnaire?.responses[0].id,
    value: subscription?.questionnaire?.responses[0].response,
    label: subscription?.questionnaire?.responses[0].response,
    data: subscription?.questionnaire?.responses[0],
  });
  const [additionalAnswer, setAdditionalAnswer] = useState('');

  useEffect(() => {
    openedProp && onOpenRequest();
  }, [openedProp]);

  const onOpenRequest = () => {
    getQuestionnaire({
      body: { type: 1 },
      actions: {
        onSuccess: (data: QuestionnaireEventData) => {
          setSelectedOption({
            id: data.responses[0].id,
            value: data.responses[0].response,
            label: data.responses[0].response,
            data: data.responses[0],
          });
          setQuestionnaireOpened(true);
        },
        onError: () => {
          toast.error("La fonction n'est pas disponible pour le moment");
        },
        onFetchEnd: () => setLoading(false),
      },
    });
  };

  const onQuestionnaireClose = (): null => {
    setQuestionnaireOpened(false);
    onClose();
    return null;
  };

  const onAnswerChange = (answer: RadioInputOption) => {
    if (!answer.data.otherResponse) {
      setAdditionalAnswer('');
    }
    setSelectedOption(answer);
  };

  const onAnswerSend = () => {
    answerToQuestionnaire({
      body: {
        questionId: subscription.questionnaire.id,
        responseId: selectedOption.id,
        additionalAnswer,
      },
      actions: {
        onSuccess: (data: any) => {
          onQuestionnaireClose();
          setTimeout(() => resetQuestionnaire(), 1000);
          onAnswerSubmit(data);
        },
      },
    });
  };

  return (
    <Wrapper>
      <Modal
        ariaHideApp={false}
        isOpened={questionnaireOpened}
        style={modalStyle(width)}
        onClose={onQuestionnaireClose}
        overlayClassName="transition"
        headerDescription={subscription.questionnaire?.qustion}
        withHeader
        backButtonHidden
      >
        <ModalInner>
          {loading && (
            <LoaderWrapper>
              <Loader type="Oval" color={colors.white} height={30} width={30} />
            </LoaderWrapper>
          )}
          <RadioInput
            direction="row"
            onChange={onAnswerChange}
            defaultOption={selectedOption}
            options={subscription.questionnaire?.responses?.map(
              (item: QuestionnaireResponse): RadioInputOption => ({
                id: item.id,
                value: item.response,
                label: item.response,
                data: item,
              }),
            )}
          />
          {selectedOption?.data?.otherResponse && (
            //@ts-ignore
            <Input
              redesigned
              label={'Please let us know: '}
              inputProps={{
                //@ts-ignore
                onChange: (ev: SyntheticEvent) => setAdditionalAnswer(ev.target.value),
              }}
            />
          )}
          <Button color="green" style={{ width: 'fit-content' }} onClick={onAnswerSend}>
            Sauvegarder
          </Button>
        </ModalInner>
      </Modal>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getQuestionnaire: (data) => dispatch(getCancelSubscriptionQuestionnaireAction(data)),
    answerToQuestionnaire: (data: {
      body: { questionId: string; responseId: string; additionalAnswer: string };
      actions?: RequestActions;
    }) => dispatch(answerToQuestionnaireAction(data)),
    resetQuestionnaire: () => dispatch(setQuestionnaireAction(null)),
  };
}

const mapStateToProps = createStructuredSelector({
  subscription: makeSelectSubscription(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CancelSubscriptionQuestionnaire);
