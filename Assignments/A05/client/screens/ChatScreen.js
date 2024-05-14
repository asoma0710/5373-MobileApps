import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const initialIndividualChat = [
    { id: 1, text: 'Hi there!', sender: 'user' },
    { id: 2, text: 'Hello! How can I help you?', sender: 'bot' },
    { id: 3, text: 'What are your store hours?', sender: 'user' },
    { id: 4, text: 'Our store hours are from 9:00 AM to 8:00 PM.', sender: 'bot' },
    // Add more hardcoded Q&A for Anita here...
  ];

  const initialGroupChat = [
    { id: 1, text: 'Hello everyone!', sender: 'user' },
    { id: 2, text: 'Hey there! What\'s up?', sender: 'bot' },
    { id: 3, text: 'What are we having for dinner tonight?', sender: 'user' },
    { id: 4, text: 'We\'re having spaghetti and meatballs.', sender: 'bot' },
    // Add more hardcoded Q&A for the Family group here...
  ];

  const startIndividualChat = (contact) => {
    setCurrentChat(contact);
    setMessages(initialIndividualChat);
  };

  const startGroupChat = (group) => {
    setCurrentChat(group);
    setMessages(initialGroupChat);
  };

  const sendMessage = () => {
    if (messageText.trim() === '') return; // Don't send empty messages
    const newMessage = { id: messages.length + 1, text: messageText, sender: 'user' };
    setMessages([...messages, newMessage]);
    setMessageText(''); // Clear the input field after sending the message
    setTimeout(() => {
      receiveMessage('I received your message.');
    }, 1000);
  };

  const receiveMessage = (messageText) => {
    const newMessage = { id: messages.length + 1, text: messageText, sender: 'bot' };
    setMessages([...messages, newMessage]);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>{item.text}</Text>
    </View>
  );

  const handleBackButton = () => {
    setCurrentChat(null); // Reset currentChat state when navigating back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {currentChat ? (
        <>
          <Text style={styles.chatTitle}>{currentChat.name}</Text>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            inverted
            contentContainerStyle={styles.chatList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type your message..."
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.chatOptions}>
          <TouchableOpacity style={styles.optionButton} onPress={() => startIndividualChat({ id: 1, name: 'Anita' })}>
            <Text style={styles.optionText}>Start Individual Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => startGroupChat({ id: 2, name: 'Family' })}>
            <Text style={styles.optionText}>Start Group Chat</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  messageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    fontSize: 16,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  chatOptions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  chatList: {
    flexGrow: 1,
  },
});

export default ChatScreen;
