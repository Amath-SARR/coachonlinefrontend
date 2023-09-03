/**
 *
 * Students
 *
 */

import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from '@reduxjs/toolkit';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { FlexColumn, FlexRow, Text } from '../../../global-styles';
import { colors } from '../../../utils/colors';
import makeSelectFaq from '../../../store/faq/faq.selectors';
import { getCategories, getTopic, searchInTopics } from '../../../store/faq/faq.slice';
import { Category, Topic } from '../../../store/faq/faq.types';
import PageContainer from '../../../components/PageContainer';
import WysiwygConsumer from '../../../components/WysiwygConsumer/wysiwyg-consumer';
import { Title } from '../Contracts/contracts';
import AffiliationBannerImg from '../../../images/images/affiliation-banner.jpg';
import ChevronDownImg from '../../../images/icons/chevron-down.svg';

import Banner from '../../../components/Banner';
import Input from '../../../components/Input';
import useWindowSize from '../../../hooks/useWindowSize';

const Wrapper = styled.div``;
const Row = styled(FlexRow)`
  @media screen and (max-width: 920px) {
    flex-direction: column;
  }
`;
const LinkWrapper = styled.div`
  color: black;
`;
const AffiliationBanner = styled(Banner)`
  max-height: 550px;
  top: 0;
  overflow: hidden;
  @media screen and (max-width: 600px) {
    visibility: hidden;
  }
`;
const BannerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(closest-side, ${colors.backgroundBlue}CC 0%, transparent 100%);
  top: 0;
  left: 0;
`;
const ChildrenWrapper = styled.div`
  padding-left: 25px;
`;
const Navigator = styled(FlexColumn)`
  flex: 1;
`;
const Link = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 19px;
  font-weight: 500;
  padding: 10px 0;
  color: ${colors.lilac};
`;
const Accordion = styled.div`
  height: ${(props) => props.height};
  overflow: hidden;
  transition: height 0.5s ease-in-out;
`;
const WysiwygWrapper = styled(FlexColumn)`
  padding: 0 20px;
  flex: 4;
  color: ${colors.lilac};
`;
const LoaderWrapper = styled.div`
  margin: auto;
`;

const InputWrapper = styled.div`
  max-width: 1200px;
  margin: 200px auto;
  z-index: 2;
  position: relative;
  @media screen and (max-width: 920px) {
    padding: 0 20px;
    margin: 100px auto;
  }
  @media screen and (max-width: 600px) {
    margin: 40px auto;
  }
`;
const SearchResultsWrapper = styled.div`
  //background-color: ${colors.backgroundBlue};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: max-content;
  max-height: 300px;
  overflow: auto;
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 0;
  border: 2px solid ${colors.mainGreen};
  transform: translateY(93%);
  @media screen and (max-width: 920px) {
    width: calc(100% - 40px);
  }
`;
const SearchResult = styled.div`
  cursor: pointer;
  color: ${colors.lilac};
  border-bottom: 1px solid ${colors.borderDark};
  padding: 15px 5px;
`;
const IconWrapper = styled.div`
  width: 10px;
  cursor: pointer;
  min-width: 10px;
  margin-left: 5px;
`;
const Icon = styled.img`
  width: 100%;
  height: auto;
`;

interface TabProp {
  label: string;
  id: number | string;
}

// This const Tab will display the content of the CategoryItem
const Tab = (props: {
  tab: TabProp;
  onSelect: (item: Category | Topic) => void;
  children?: React.ReactNode;
  item: Category | Topic;
  textStyle?: React.CSSProperties;
  current?: Topic;
  openable?: boolean;
  opened?: boolean;
}) => {
  const { tab, children, onSelect, item, textStyle = {}, current, openable, opened } = props;
  const selected = current?.topicId?.toString() === tab.id?.toString();
  return (
    <LinkWrapper>
      <Link
        onClick={() => onSelect(item)}
        style={{
          color: `${colors.mainGreen}`,
          borderLeft: selected ? `3px solid ${colors.mainGreen}` : 'none',
          paddingLeft: 5,
          ...textStyle,
        }}
      >
        <p>{tab.label}</p>
        {openable && (
          <IconWrapper onClick={(ev) => null}>
            <Icon
              style={{ filter: 'invert(1)', transform: `rotate(${opened ? '180deg' : '0deg'})` }}
              src={ChevronDownImg}
            />
          </IconWrapper>
        )}
      </Link>
      <ChildrenWrapper style={{ color: 'black' }}>{children}</ChildrenWrapper>
    </LinkWrapper>
  );
};

export interface CategoryProps {
  category: Category;
  onTopicSelect: (topic: Topic) => void;
  currentTopic: Topic | null;
}

export interface CategoriesProps extends Omit<CategoryProps, 'category'> {
  categories: Category[] | null;
}

// This const CategoryItem will display the categorie and the topic content
const CategoryItem = (props: CategoryProps) => {
  const { category, onTopicSelect, currentTopic } = props;
  console.log('children opened', category?.categoryId, currentTopic?.categoryId);
  const [childrenVisible, setChildrenVisible] = useState(
    category?.categoryId === currentTopic?.categoryId,
  );

  useEffect(() => {
    toggleChildren(category?.categoryId === currentTopic?.categoryId);
  }, [currentTopic?.categoryId]);

  const toggleChildren = (visible: boolean) => setChildrenVisible(visible);

  return (
    <Tab
      key={category.categoryId}
      tab={{ label: category.categoryName, id: category.categoryId }}
      item={category}
      onSelect={() => toggleChildren(!childrenVisible)}
      openable
      opened={childrenVisible}
    >
      <Accordion height={childrenVisible ? 'fit-content' : 0}>
        {category.topics?.map((topic: Topic) => (
          <Tab
            current={currentTopic}
            key={topic.topicName}
            tab={{ label: topic.topicName, id: topic.topicId }}
            item={topic}
            onSelect={onTopicSelect}
            textStyle={{ fontSize: 18, fontWeight: 500 }}
          />
        ))}
      </Accordion>
    </Tab>
  );
};

// This const Categories will create the mapping for displaying the categories
const Categories = (props: CategoriesProps) => {
  const { categories = [] } = props;
  return (
    <>
      {categories?.map((category: Category) => <CategoryItem category={category} {...props} />) ||
        null}
    </>
  );
};

export function Faq({ faq, fetchCategories, fetchTopic, searchTopics }) {
  const faqBodyRef = useRef();
  const { width } = useWindowSize();
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(faq.categories?.topics?.[0]);
  const [editorRefreshing, setEditorRefreshing] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);
  const [searchResult, setSearchResult] = useState<Topic[] | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onCategoryFetch();
  }, []);

  // onTopicSelect will change the current Topic selected and get all the informations if it's correct
  const onTopicSelect = (topic: Topic) => {
    setSearchTimeout(null);
    const { topicId: id } = topic;
    if (searchResult) {
      setSearchResult(null);
      setSearchTouched(false);
    }
    if (!hasChanges) {
      return changeTopic(id);
    }
  };

  const scrollToBody = () => {
    const y = faqBodyRef?.current?.getBoundingClientRect().top + window.pageYOffset + -100;
    return window.scrollTo({
      top: y,
      behavior: 'smooth',
      // block: 'start',
    });
  };

  const changeTopic = (id: number | undefined) => {
    setEditorRefreshing(true);
    onTopicFetch(id);
  };

  // onTopicFetch will execute the request to get the data for a specific topic
  const onTopicFetch = (id) => {
    fetchTopic({
      body: { id },
      actions: {
        onSuccess: (topic: Topic) => {
          setCurrentTopic(topic);
          refreshEditor();
          scrollToBody();
        },
        onError: () => setEditorRefreshing(false),
      },
    });
  };

  const onCategoryFetch = () => {
    fetchCategories({
      actions: {
        onSuccess: (categories: Category[]) => onTopicFetch(categories[0]?.topics[0]?.topicId),
      },
    });
  };

  const refreshEditor = () => {
    setEditorRefreshing(true);
    setHasChanges(false);
    setTimeout(() => setEditorRefreshing(false), 1000);
  };

  const onSearch = (value: string) => {
    if (!value) {
      setSearchTouched(false);
      setSearchResult(null);
      console.log(faq?.categories?.topics);
      return;
    }
    if (value?.length > 2) {
      searchTopics({
        body: { value },
        actions: {
          onSuccess: (topics: Topic[]) => {
            setSearchResult(topics);
          },
          onFetchEnd: () => setSearchTouched(true),
        },
      });
    }
  };

  const onSearchInputChange = (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => onSearch(value), 500));
  };

  return (
    <Wrapper>
      <PageContainer
        renderOutsideWindowContainer={
          <>
            <InputWrapper>
              <Input
                label={'Comment pouvons-nous vous aider ?'}
                style={{ zIndex: 2 }}
                redesigned
                labelStyle={{
                  fontSize: width > 700 ? 30 : 22,
                  fontWeight: 700,
                  textAlign: 'center',
                  paddingBottom: '20px',
                  width: '100%',
                }}
                inputProps={{
                  placeholder: 'Une question ?',
                  onChange: (ev) => onSearchInputChange(ev.target?.value),
                  style: {
                    fontSize: 25,
                    zIndex: 1,
                    borderRadius: 10,
                    backgroundColor: colors.primaryBackgroundLight,
                    color: colors.black,
                    border: `4px solid ${colors.mainGreen}`,
                  },
                }}
              />
              {searchTouched && (
                <SearchResultsWrapper>
                  {!!searchResult?.length ? (
                    searchResult.map((topic: Topic, key) => (
                      <SearchResult key={topic.id} onClick={() => onTopicSelect(topic)}>
                        {topic.topicName}
                      </SearchResult>
                    ))
                  ) : (
                    <Text style={{ padding: '20px 5px' }}>No topics found</Text>
                  )}
                </SearchResultsWrapper>
              )}
            </InputWrapper>
            {/* <AffiliationBanner src={AffiliationBannerImg}>
              <BannerOverlay />
            </AffiliationBanner> */}
          </>
        }
        style={{ innerWrapper: { position: 'relative', zIndex: 1 } }}
        colorScheme={'dark'}
        showNavBar
      >
        <Row ref={faqBodyRef}>
          <Navigator>
            <Categories
              categories={faq.categories}
              onTopicSelect={onTopicSelect}
              currentTopic={currentTopic}
            />
          </Navigator>
          <WysiwygWrapper>
            {editorRefreshing && (
              <LoaderWrapper>
                <Loader type="Oval" color={colors.mainGreen} height={35} width={25} />
              </LoaderWrapper>
            )}
            {!editorRefreshing && (
              <>
                <Title>{currentTopic?.topicName}</Title>
                <WysiwygConsumer html={currentTopic?.topicBody} />
              </>
            )}
          </WysiwygWrapper>
        </Row>
      </PageContainer>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  faq: makeSelectFaq(),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch,
    fetchCategories: (data) => dispatch(getCategories(data)),
    fetchTopic: (data) => dispatch(getTopic(data)),
    searchTopics: (data) => dispatch(searchInTopics(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Faq);
