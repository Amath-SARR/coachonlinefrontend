import styled from 'styled-components';
import { colors } from '../utils/colors';

export const StyledWrapper = styled.div`
  margin-bottom: 15px;
`;
export const StyledLabel = styled.p`
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 10px;
  color: ${colors.white};
  padding-left: 10px;
`;
export const StyledInputBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${colors.inputBlue};
  color: ${colors.white};
  border-radius: 5px;
  padding: 10px;
  outline: none;
  border: none;
`;
