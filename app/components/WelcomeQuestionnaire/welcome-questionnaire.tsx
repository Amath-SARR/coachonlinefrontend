/**
 *
 * WelcomeQuestionnaire
 *
 */

import React, { SyntheticEvent, useEffect, useState } from 'react';
import WelcomeQuestionnaireProps from './welcome-questionnaire.props';
import styled from 'styled-components';
import { DispatchType, RequestActions } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import makeSelectAuth from '../../containers/Auth/selectors';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import { authModalStyles } from '../../containers/Auth';
import RadioInput from '../RadioInput/radio-input';
import { QuestionnaireResponse } from '../ConnectionsTrackerSignalR/types';
import { RadioInputOption } from '../RadioInput/radio-input.props';
import { answerToQuestionnaireAction, setQuestionnaireAction } from '../../containers/Auth/actions';
import Input from '../Input';
import Button from '../Button';

const Wrapper = styled.div``;
const ModalInner = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
`;

const modalStyle = (width: number) => ({
  ...authModalStyles(width),
  content: {
    ...authModalStyles(width).content,
  },
});

function WelcomeQuestionnaire(props: WelcomeQuestionnaireProps) {
  const { width } = useWindowSize();
  const { auth = {}, answerToQuestionnaire = () => null, resetQuestionnaire = () => null } = props;

  const [questionnaireOpened, setQuestionnaireOpened] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    id: auth.questionnaire?.responses[0].id,
    value: auth.questionnaire?.responses[0].response,
    label: auth.questionnaire?.responses[0].response,
    data: auth.questionnaire?.responses[0],
  });
  const [additionalAnswer, setAdditionalAnswer] = useState('');

  useEffect(() => {
    onQuestionnaireChange();
  }, [auth.questionnaire]);

  const onQuestionnaireChange = () => {
    if (auth.questionnaire) {
      setQuestionnaireOpened(true);
    }
  };

  const onQuestionnaireClose = () => {
    setQuestionnaireOpened(false);
  };

  const onAnswerChange = (answer: RadioInputOption) => {
    if (!answer.data.otherResponse) {
      setAdditionalAnswer('');
    }
    setSelectedOption(answer);
  };

  const onAnswerSend = () => {
    answerToQuestionnaire({
      body: { questionId: auth.questionnaire.id, responseId: selectedOption.id, additionalAnswer },
      actions: {
        onSuccess: () => {
          onQuestionnaireClose();
          setTimeout(() => resetQuestionnaire(), 1000);
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
        headerDescription={auth.questionnaire?.qustion}
        withHeader
        backButtonHidden
      >
        <ModalInner>
          <RadioInput
            direction="row"
            onChange={onAnswerChange}
            defaultOption={selectedOption}
            options={auth.questionnaire?.responses?.map(
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
    answerToQuestionnaire: (data: {
      body: { questionId: string; responseId: string; additionalAnswer: string };
      actions?: RequestActions;
    }) => dispatch(answerToQuestionnaireAction(data)),
    resetQuestionnaire: () => dispatch(setQuestionnaireAction(null)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(WelcomeQuestionnaire);
