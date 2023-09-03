import CanaroExtraLightWoff from './fonts/canaro/CanaroExtraLight/font.woff';
import CanaroExtraLightWoff2 from './fonts/canaro/CanaroExtraLight/font.woff2';
import CanaroThinWoff from './fonts/canaro/CanaroThin/font.woff';
import CanaroThinWoff2 from './fonts/canaro/CanaroThin/font.woff2';
import CanaroLightWoff from './fonts/canaro/CanaroLight/font.woff';
import CanaroLightWoff2 from './fonts/canaro/CanaroLight/font.woff2';
import CanaroBookWoff from './fonts/canaro/CanaroBook/font.woff';
import CanaroBookWoff2 from './fonts/canaro/CanaroBook/font.woff2';
import CanaroMediumWoff from './fonts/canaro/CanaroMedium/font.woff';
import CanaroMediumWoff2 from './fonts/canaro/CanaroMedium/font.woff2';
import CanaroSemiBoldWoff from './fonts/canaro/CanaroSemiBold/font.woff';
import CanaroSemiBoldWoff2 from './fonts/canaro/CanaroSemiBold/font.woff2';
import CanaroBoldWoff from './fonts/canaro/CanaroBold/font.woff';
import CanaroBoldWoff2 from './fonts/canaro/CanaroBold/font.woff2';
import CanaroExtraBoldWoff from './fonts/canaro/CanaroExtraBold/font.woff';
import CanaroExtraBoldWoff2 from './fonts/canaro/CanaroExtraBold/font.woff2';
import CanaroBlackWoff from './fonts/canaro/CanaroBlack/font.woff';
import CanaroBlackWoff2 from './fonts/canaro/CanaroBlack/font.woff2';

import CanaroExtraLightItalicWoff from './fonts/canaro/CanaroExtraLightItalic/font.woff';
import CanaroExtraLightItalicWoff2 from './fonts/canaro/CanaroExtraLightItalic/font.woff2';
import CanaroThinItalicWoff from './fonts/canaro/CanaroThinItalic/font.woff';
import CanaroThinItalicWoff2 from './fonts/canaro/CanaroThinItalic/font.woff2';
import CanaroLightItalicWoff from './fonts/canaro/CanaroLightItalic/font.woff';
import CanaroLightItalicWoff2 from './fonts/canaro/CanaroLightItalic/font.woff2';
import CanaroBookItalicWoff from './fonts/canaro/CanaroBookItalic/font.woff';
import CanaroBookItalicWoff2 from './fonts/canaro/CanaroBookItalic/font.woff2';
import CanaroMediumItalicWoff from './fonts/canaro/CanaroMediumItalic/font.woff';
import CanaroMediumItalicWoff2 from './fonts/canaro/CanaroMediumItalic/font.woff2';
import CanaroSemiBoldItalicWoff from './fonts/canaro/CanaroSemiBoldItalic/font.woff';
import CanaroSemiBoldItalicWoff2 from './fonts/canaro/CanaroSemiBoldItalic/font.woff2';
import CanaroBoldItalicWoff from './fonts/canaro/CanaroBoldItalic/font.woff';
import CanaroBoldItalicWoff2 from './fonts/canaro/CanaroBoldItalic/font.woff2';
import CanaroExtraBoldItalicWoff from './fonts/canaro/CanaroExtraBoldItalic/font.woff';
import CanaroExtraBoldItalicWoff2 from './fonts/canaro/CanaroExtraBoldItalic/font.woff2';
import CanaroBlackItalicWoff from './fonts/canaro/CanaroBlackItalic/font.woff';
import CanaroBlackItalicWoff2 from './fonts/canaro/CanaroBlackItalic/font.woff2';

const GlobalFonts = `
  @font-face {
    font-family: "Canaro";
    src: local('CanaroExtraLight'), local('Canaro extra light');
    src: url(${CanaroExtraLightWoff2}) format('woff2'), url(${CanaroExtraLightWoff})format('woff');
    font-weight: 100;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroThin'), local('Canaro thin');
    src: url(${CanaroThinWoff2}) format('woff2'), url(${CanaroThinWoff})format('woff');
    font-weight: 200;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroLight'), local('Canaro light');
    src: url(${CanaroLightWoff2}) format('woff2'), url(${CanaroLightWoff})format('woff');
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBook'), local('Canaro book');
    src: url(${CanaroBookWoff2}) format('woff2'), url(${CanaroBookWoff})format('woff');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroMedium'), local('Canaro medium');
    src: url(${CanaroMediumWoff2}) format('woff2'), url(${CanaroMediumWoff})format('woff');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroSemiBold'), local('Canaro semi bold');
    src: url(${CanaroSemiBoldWoff2}) format('woff2'), url(${CanaroSemiBoldWoff})format('woff');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBold'), local('Canaro bold');
    src: url(${CanaroBoldWoff2}) format('woff2'), url(${CanaroBoldWoff})format('woff');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroExtraBold'), local('Canaro extra bold');
    src: url(${CanaroExtraBoldWoff2}) format('woff2'), url(${CanaroExtraBoldWoff})format('woff');
    font-weight: 800;
    font-style: normal;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBlack'), local('Canaro black');
    src: url(${CanaroBlackWoff2}) format('woff2'), url(${CanaroBlackWoff})format('woff');
    font-weight: 900;
    font-style: normal;
  }

    @font-face {
    font-family: "Canaro";
    src: local('CanaroExtraLightItalic'), local('Canaro extra light italic');
    src: url(${CanaroExtraLightItalicWoff2}) format('woff2'), url(${CanaroExtraLightItalicWoff})format('woff');
    font-weight: 100;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroThinItalic'), local('Canaro thin italic');
    src: url(${CanaroThinItalicWoff2}) format('woff2'), url(${CanaroThinItalicWoff})format('woff');
    font-weight: 200;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroLightItalic'), local('Canaro light italic');
    src: url(${CanaroLightItalicWoff2}) format('woff2'), url(${CanaroLightItalicWoff})format('woff');
    font-weight: 300;
    font-style: italic ;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBookItalic'), local('Canaro book italic');
    src: url(${CanaroBookItalicWoff2}) format('woff2'), url(${CanaroBookItalicWoff})format('woff');
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroMediumItalic'), local('Canaro medium italic');
    src: url(${CanaroMediumItalicWoff2}) format('woff2'), url(${CanaroMediumItalicWoff})format('woff');
    font-weight: 500;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroSemiBoldItalic'), local('Canaro semi bold italic');
    src: url(${CanaroSemiBoldItalicWoff2}) format('woff2'), url(${CanaroSemiBoldItalicWoff})format('woff');
    font-weight: 600;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBoldItalic'), local('Canaro bold italic');
    src: url(${CanaroBoldItalicWoff2}) format('woff2'), url(${CanaroBoldItalicWoff})format('woff');
    font-weight: 700;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroExtraBoldItalic'), local('Canaro extra bold italic');
    src: url(${CanaroExtraBoldItalicWoff2}) format('woff2'), url(${CanaroExtraBoldItalicWoff})format('woff');
    font-weight: 800;
    font-style: italic;
  }
  @font-face {
    font-family: "Canaro";
    src: local('CanaroBlackItalic'), local('Canaro black italic');
    src: url(${CanaroBlackItalicWoff2}) format('woff2'), url(${CanaroBlackItalicWoff})format('woff');
    font-weight: 900;
    font-style: italic;
  }
`;

export default GlobalFonts;
