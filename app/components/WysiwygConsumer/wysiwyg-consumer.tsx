/**
 *
 * WysiwygConsumer
 *
 */

import React from 'react';
import WysiwygConsumerProps from './wysiwyg-consumer.props';
import styled from 'styled-components';
import { DispatchType } from '../../types';
import { colors } from '../../utils/colors';

const Wrapper = styled.div``;
const HtmlWrapper = styled.div`
  color: ${colors.lilac};
`;

function WysiwygConsumer(props: WysiwygConsumerProps) {
  const { html } = props;
  return (
    <Wrapper>
      <HtmlWrapper dangerouslySetInnerHTML={{ __html: html }} />
    </Wrapper>
  );
}

export default WysiwygConsumer;
