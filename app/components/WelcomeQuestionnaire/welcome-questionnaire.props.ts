import { RequestActions } from '../../types';

export default interface WelcomeQuestionnaireProps {
  auth?: any;
  answerToQuestionnaire?: (data: {
    body: { questionId: string; responseId: string; additionalAnswer: string };
    actions?: RequestActions;
  }) => void;
  resetQuestionnaire?: () => void;
}
