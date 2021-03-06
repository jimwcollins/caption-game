import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { UserContext } from '../../Context/UserContext';

import {
  getPic,
  getRound,
  getPicOrder,
  postAnswerToUser,
  toggleGame,
} from '../../utils/databaseFuncs';

import NewButton from '../../components/NewButton';
import MainHeader from '../../components/MainHeader';
import styles from './RoundStyles';

export default function Round(props) {
  const [picRef, setPicRef] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [round, setRound] = useState();

  const { user, roomCode } = useContext(UserContext);

  const {
    navigation: { replace },
  } = props;

  useEffect(() => {
    getRound(roomCode).then((round) => {
      setRound(round);
      toggleGame(roomCode);
      getPicOrder(roomCode).then((picOrder) => {
        getPic(picOrder, round).then((picRef) => {
          setPicRef(picRef);
          setIsLoading(false);
        });
      });
    });
  }, []);

  const submitAnswer = () => {
    if (answer === '') Alert.alert('Please enter an answer');
    else {
      postAnswerToUser(user.username, roomCode, answer).then(() => {
        replace('GameWaitingRoom', { picRef });
      });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#820263', '#C8005E']}
          style={styles.background}
        />
        <MainHeader text={`Round ${round}`} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={45}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.screen}
        >
          <SafeAreaView style={styles.screen}>
            {!isLoading && (
              <View style={styles.picShadow}>
                <View style={styles.picContainer}>
                  <Image source={{ uri: picRef }} style={styles.pic} />
                </View>
              </View>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                multiline={true}
                onChangeText={(text) => setAnswer(text)}
                value={answer}
                style={styles.input}
                maxLength={75}
              />
              <Text style={styles.charsLeft}>
                {75 - answer.length} characters left{' '}
              </Text>
            </View>
            <NewButton onPress={submitAnswer}>
              <Text>Submit answer</Text>
            </NewButton>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
