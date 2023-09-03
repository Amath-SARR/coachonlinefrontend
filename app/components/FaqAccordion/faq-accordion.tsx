/**
 *
 * FaqAccordion
 *
 */

import React, { memo, useEffect, useState } from 'react';
import FaqAccordionProps from './faq-accordion.props';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { DispatchType } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import ChevronDown from '../../images/icons/chevron_down_blue.png';
import ChevronUp from '../../images/icons/chevron_up_blue.png';
import makeSelectFaq from '../../store/faq/faq.selectors';
import { getCategories, getTopicByCategory } from '../../store/faq/faq.slice';
import { Topic } from '../../store/faq/faq.types';
import img from '../../images/images/background-image.jpg';

const Wrapper = styled.div`
  //background-image: url(${img});
  //background-position: center; 
`;
const AccordionSection = styled.div`
  display: flex;
  padding: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: abosulte; // position: relative;
  // height: 100vh;
  background: #f8f7fb;
`;

const Container = styled.div`
  position: relative; // position: absolute;
  //top: 30%;
  box-shadow: 2px 10px 35px 1px rgba(153, 153, 153, 0.3);
  width: 1000px;
  @media screen and (max-width: 1014px) {
    max-width: 600px;
  }
  @media screen and (max-width: 500px) {
    max-width: 300px;
  }
`;

const Wrap = styled.div`
  background: #fff;
  color: ${colors.lilac};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: center;
  cursor: pointer;
  h1 {
    padding: 2rem;
    font-size: 25px;
  }
  span {
    margin-right: 20px;
  }
  @media screen and (max-width: 500px) {
    h1 {
      font-size: 18px;
    }
  }
`;

const Dropdown = styled.div`
  background: #f8f7fb;
  color: ${colors.lilac};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.p`
  font-size: 25px;
  font-weight: 600;
  text-align: start;
  margin: 20px;
  font-size: 22px;
  @media screen and (max-width: 920px) {
    font-size: 18px;
  }
`;

const DropdownTopic = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.lilac};
`;
const Title = styled.p`
  font-size: 40px;
  font-weight: 700;
  color: ${colors.lilac};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
  @media screen and (max-width: 920px) {
    font-size: 20px;
    padding: 20px;
  }
`;
const TopicBody = styled.div`
  @media screen and (max-width: 920px) {
    font-size: 15px;
  }
`;
const Chevron = styled.img`
@media screen and (max-width: 920px) {
 width: 25px;
`;
export interface CategoryProps {
  category: Category;
  onTopicSelect: (topic: Topic) => void;
  currentTopic: Topic | null;
}

export interface CategoriesProps extends Omit<CategoryProps, 'category'> {
  categories: Category[] | null;
}

function FaqAccordion(props: FaqAccordionProps) {
  const [clicked, setClicked] = useState(false);
  const { faq, getCategories, getTopicByCategory } = props || {};
  const [currentTopics, setCurrentTopics] = useState<Topic[] | null>([]);

  useEffect(() => {
    getCategories();
  }, []);

  // This function will execute the request to get the topic with a certain categorie
  const onTopicFetch = (id) => {
    getTopicByCategory({
      body: { id },
      actions: {
        onSuccess: (topics) => {
          // console.log('success ', topics);
          setCurrentTopics(topics);
        },
        onError: () => {
          console.log('error topics fetch');
        },
      },
    });
  };

  const toggle = (index, catId) => {
    if (clicked === index) {
      //if clicked question is already active, then close it
      return setClicked(null);
    }
    setClicked(index);

    // When the categorie is changed, we need to get the topics from this categories
    onTopicFetch(catId);
  };
  //  categories est le thème par exemple : 'Questions Fréquentes'
  //  topicName est la Question par exemple : 'Qu'est ce que Coachs Online'
  //  topicBody est le contenu de la question par exemple : 'Coachs Online est une plate-forme de streaming qui permet à quiconque de regarder,...'
  //  Need to improve the displaying aspect for the "topicBody"
  return (
    <Wrapper>
      <Title>Questions fréquentes</Title>
      <AccordionSection>
        <Container>
          {faq?.categories.map((item, index) => (
            <>
              <div>
                <Wrap onClick={() => toggle(index, item.categoryId)} key={index}>
                  <h1>{item.categoryName}</h1>
                  <span>
                    {clicked === index ? (
                      <Chevron src={ChevronUp} />
                    ) : (
                      <Chevron src={ChevronDown} />
                    )}
                  </span>
                </Wrap>
              </div>
              {clicked === index ? (
                <Dropdown>
                  <div>
                    {item.topics?.map((topic, index) => (
                      <>
                        <DropdownTopic key={index}>
                          <Name>{topic.topicName}</Name>
                          <br />
                          <TopicBody
                            dangerouslySetInnerHTML={{
                              __html: currentTopics[index]?.topicBody?.toString(),
                            }}
                          />
                        </DropdownTopic>
                      </>
                    ))}
                  </div>
                </Dropdown>
              ) : null}
            </>
          ))}
        </Container>
      </AccordionSection>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getCategories: () => dispatch(getCategories()),
    getTopicByCategory: (data) => dispatch(getTopicByCategory(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  faq: makeSelectFaq(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(FaqAccordion);