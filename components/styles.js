import styled from 'styled-components/native';
import { View, Text, Image, Platform, StatusBar, TextInput,TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const StatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

export const Colors = {
  primary: "#ffffff",
  secondary: "#E8EEF1",
  tertiary: "#1E3D58",
  darklight: "#9CA3AF",
  brand: "#00B2FF",
  green: "#10B981",
  red: "#f37272ff",
  brandViolet: "#ad90e7ff",
  see:'rgba(0,0,0,0)',
  detailcolor: '#E7EDFF',
};

const { primary,secondary,tertiary,darklight,brand,green,red,brandViolet,detailcolor } = Colors;

export const StyleContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 40}px;
  background-color: rgba(0,0,0,0);
`;

export const InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled(Image)`
  width: 250px;
  height: 200px;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  font-family: "Lato-Bold";
  text-align: center;
  font-weight: bold;
  color: #ffff;
  padding-top: 5px;
  margin-bottom: 10px;
`;
export const SubPageTitle = styled(Text)`
    font-size: 25px;
  text-align: center;
  font-weight: bold;
  color: #ffff;
  padding-bottom: 5px;
`;
export const SubTitle = styled(Text)`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing : 1px;
    font-weight: bold;
    color: #ffff;
`;

export const StyledFormArea = styled(View)`
  
    width: 95%;
    background-color: #ffff;
    padding: 20px;
    border-radius: 10px;
    justify-content: center;
`;

export const StyledTextInput = styled(TextInput)`
  width: "100%";
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 30px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled(Text)`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
  margin-left:10px;
`;

export const LeftIcon = styled(View)`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 65px;
  align-items: center;

  ${(props) => props.google == true && `
    background-color: ${green};
    flex-direction: row;
    justify-content: center;
    `}
`;

export const ButtonText = styled(Text)`
  color: ${primary};
  font-size: 16px;

    ${(props) => props.google == true && `
      padding: 7px;
    `}
`;

export const MessageBox = styled(Text)`
  text-align: center;
  font-size: 15px;
  color: ${red};
`;

export const Line = styled(Text)`
  text-align: center;
  width: 350px;
`;

export const ExtraView = styled(View)`
      justify-content: center;
      flex-direction: row;
      align-items: center;
      padding: 10px;
`;

export const ExtraText = styled(Text)`
      justify-content: center;
      align-content: center;
      color: ${tertiary};
      font-size: 15px;
`;

export const TextLink = styled(TouchableOpacity)`
      justify-content: center;
      align-items: center;
`;

export const TextLinkContent = styled(Text)`
      color: #69509A;
      font-size: 15px; 
`;

export const Spacer = styled(View)`
      padding: 50px;
`;
export const SignupSpace = styled(View)`
      padding: 15px;
`;
export const  background= styled(Image)`
  flex: 1;
  justifyContent: "center"; 
  alignItems: "center";
`;
export const ScanContainer= styled(View)`
  width: 100%;
  height: 90px;
  align-items: left;
  background-color: ${detailcolor};
  border-width :1px;
  border-color:${brand};  
  border-radius : 10px;
`;
export const DetailsContainer= styled(View)`
  width: 100%;
  flex:1;
  align-items: center;
  background-color: ${detailcolor};
  border-color: ${brand};
  border-radius: 10px;
  border-width :1px;
 
`;
export const LedContainer= styled(View)`
  width: 100%;
  height: 100px;
  align-items: center;
  background-color: ${detailcolor} ;
  border-color: ${brand};
  border-radius: 10px;
  border-width :1px;
 
`;
export const LogoutButton= styled(TouchableOpacity)`
  padding: 5px;
  background-color: ${brand};
  justify-content: center;
  border-radius: 5px;
  margin-vertical: 15px;
  height: 30x;
  align-items: center;
  width: 30%;
`;
export const HomeText = styled(Text)`
  margin-top:25px;
  left:15px;
  font-size: 20px;
  color: #fff;
  font-weight:bold;
`;
export const StatusText = styled(Text)`
  font-size: 15px;
  color: ${brand};
`;
export const StatusLink = styled(TouchableOpacity)`
     justify-content: center;
      left: 15px;
      margin: 5px;
`;
export const HomeContainer = styled(View)`
      background-color: "#1E3D58";
      flex:1;
      align-items: start;
      gap: 8;
      padding:20px; 
      padding-top: ${StatusBarHeight - 10}px;
`;
export const TextUserWelcom = styled(Text)`
      font-size: 15px;
      color: ${primary};
      font-weight:bold;
`;

export const TestHomecontainer = styled(View)`
margin-top: 5px;
margin-bottom: 10px;
  width: 100%;
`;

export const DeviceStatusContainer = styled(View).attrs(() => ({
  style: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 6,
    },
  }),
}))`
  width: 100%;
  height: 80px;
  background-color: ${detailcolor};
  border-radius: 10px;
`;

// === ADDITIONS FOR NEW UI ===

export const PlaceholderBG = "#f3f4f6"; // new color variable

// Header container (Welcome section)
export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
`;

export const HeaderText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  color: #ffff;
`;

// Device status card
export const DeviceCard = styled(LinearGradient).attrs({
  colors: ['#69509A', '#00B2FF'],
  start: { x: 0, y: 0 },           // top-left corner
  end: { x: 1, y: 1 },  
})`
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: {width: 0, height: 2};
      shadow-opacity: 0.15;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 10;
    `,
  })}
`;

export const DeviceTitle = styled(Text)`
  font-size: 16px;
  color: #ffff;
  font-weight: bold;
`;

export const DeviceStatus = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) =>
    props.status === "Ready"
      ? green
      : props.status === "Scanning"
      ? brandViolet
      : red};
`;

// Section header (Recent Scans)
export const SectionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${tertiary};
`;

export const SectionLink = styled(Text)`
  font-size: 14px;
  color: ${brand};
`;

// Placeholder for Recent Scans empty state
export const ScanPlaceholder = styled(View)`
  background-color: ${PlaceholderBG};
  border-radius: 10px;
  height: 100px;
  margin-bottom: 10px;
`;
