import React from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';

/*  Explanatory text for affiliate links (now "liens de parrainage"), found in the affiliation-link component, is different for coaches and students */

const TextAffiliation = styled.p`
  font-size: 15px;
  color: ${colors.secondaryPink};
  text-align: left;
  margin: 10px;
  line-break: loose;
  text-justify: auto;
`;
function AffiliationText({ text, dark = false }) {
  return (
    <div>
      <TextAffiliation dark={dark}>{text}</TextAffiliation>
    </div>
  );
}

export default AffiliationText;
