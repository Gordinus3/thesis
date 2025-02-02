import React, { Children } from 'react';
import { KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Keyboard } from 'react-native';
const KbAvoidWrapper = ({children}) => {
    return (
        <KeyboardAvoidingView style ={{flex:1}} >
            <ScrollView  keyboardShouldPersistTaps="handled"> 
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KbAvoidWrapper;