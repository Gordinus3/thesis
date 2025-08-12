import styled from 'styled-components/native';
import { View, Text, Image, Platform, StatusBar, TextInput,TouchableOpacity} from 'react-native';

const StatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 20;

export const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darklight: "#9CA3AF",
  brand: "#0d66f1",
  green: "#10B981",
  red: "#EF4444",
  see:'rgba(0,0,0,0)',
  detailcolor: '#E7EDFF',
};

const { primary,secondary,tertiary,darklight,brand,green,red,detailcolor } = Colors; //vytxqr15

export const StyleContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
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
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding-top: 5px;
`;
export const SubPageTitle = styled(Text)`
    font-size: 25px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding-bottom: 5px;
`;
export const SubTitle = styled(Text)`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing : 1px;
    font-weight: bold;
    color: ${tertiary};
`;

export const StyledFormArea = styled(View)`
    width: 95%;
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
      color: ${brand};
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
  margin-top:5px;
  left:15px;
  font-size: 15px;
  color: black;
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
      flex:1;
      align-items: start;
      background-color: ${detailcolor};
      gap: 8;
      padding:15px; 
`;
export const TextUserWelcom = styled(Text)`
      font-size: 15px;
      color: ${primary};
      font-weight:bold;
`;

export const TestHomecontainer = styled(View)`
  width: 100%;
  background-color: ${primary};
  border-radius: 10px;
`;

export const SectionHeader = styled(View)`
  background-color: ${brand};
  padding: 5px 5px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;