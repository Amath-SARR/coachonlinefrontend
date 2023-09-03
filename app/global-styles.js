import styled, { createGlobalStyle } from 'styled-components';
import { colors } from './utils/colors';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Canaro', 'Roboto', Helvetica, Arial, sans-serif;
  }
  html,
  body {
    height: 100%;
    width: 100%;
    text-rendering: geometricPrecision;
    font-family: 'Canaro', 'Roboto', Helvetica, Arial, sans-serif;
    line-height: 1.2;
    background-color: ${colors.secondaryBackgroundLight};
  }

  body {
    font-family: 'Canaro', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Canaro','Roboto',  'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .dev-only {
    display: ${() => process.env.TARGET_ENV === 'production' && 'none'} !important;
  }

  .google-login-button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 10px !important;
    padding: 5px !important;
    border: none !important;
    span {
      font-size: 16px;
      font-weight: 500;
    }

  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    margin: 0;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.secondaryBackgroundLight};
    opacity: 0.4;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${colors.secondaryBackgroundLight};
    opacity: 0.4;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.secondaryBackgroundLight};
    opacity: 0.4;
  }
  //input:-webkit-autofill,
  //input:-webkit-autofill:hover,
  //input:-webkit-autofill:focus,
  //textarea:-webkit-autofill,
  //textarea:-webkit-autofill:hover,
  //textarea:-webkit-autofill:focus,
  //select:-webkit-autofill,
  //select:-webkit-autofill:hover,
  //select:-webkit-autofill:focus {
  //  border: unset;
  //  -webkit-text-fill-color: beige;
  //  -webkit-box-shadow: unset;
  //  transition: background-color 5000s ease-in-out 0s;
  //}
`;

export const FlexRow = styled.div`
  display: flex;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
export const FlexCenteredColumn = styled(FlexColumn)`
  align-items: center;
`;

export const Text = styled.p`
  color: ${colors.black};
  font-size: 14px;
`;

export const UppercaseText = styled(Text)`
  font-size: 10px !important;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

export const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  background: ${(props) => !props.isHeader && (props.isChild ? colors.inputBlue : colors.backgroundBlue)};
  color: ${(props) => props.color || colors.white};
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  min-width: fit-content;
  width: 100%;
  @media screen and (max-width: 1024px) {
    padding: 0;
  }
`; 

export const TableItem = styled.div`
  min-width: 100px;
  width: calc(100% / 6);
  font-size: 13px;
  font-weight: ${(props) => (props.isHeader ? 600 : 500)};
  color: ${colors.white};
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'center'};
  padding: 10px 5px;
`;

export const modalStyles = (width, options = {}) => ({
  overlay: {
    backgroundColor: `${colors.white}`,
    ...options.overlay,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: 'white',
    border: `1px solid ${colors.mainPink}`,
    borderRadius: 24,
    width: 675,
    maxWidth: '100%',
    ...options.content,
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
    ...options.headerTitle,
  },
});

export default GlobalStyle;
