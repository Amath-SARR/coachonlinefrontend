import { RequestActions } from '../../types';

export default interface CancelSubscriptionQuestionnaireProps {
  subscription?: any;
  answerToQuestionnaire?: (data: {
    body: { questionId: string; responseId: string; additionalAnswer: string };
    actions?: RequestActions;
  }) => void;
  resetQuestionnaire?: () => void;
  getQuestionnaire?: (data: { body: { type: 0 | 1 }; actions?: RequestActions }) => void;
  onAnswerSubmit?: (data: any) => void;
  onClose?: () => void;
  questionnaireOpened?: boolean;
}
