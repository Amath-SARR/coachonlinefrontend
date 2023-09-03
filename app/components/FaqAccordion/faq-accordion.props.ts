import { Category } from '../../store/faq/faq.types';
import { Topic } from '../../store/faq/faq.types';

export default interface FaqAccordionProps {
  category: Category;
  topic: Topic;
  faq: any;
  getCategories: () => void;
  getTopicByCategory: (payload: any) => void
}
