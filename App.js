import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoApp = () => {
  const [inputText, setInputText] = useState('');
  const [taskList, setTaskList] = useState([]);

  // Carrega as tarefas do armazenamento assim que o componente é montado
  useEffect(() => {
    fetchTasks();
  }, []);

  // Recupera tarefas salvas do AsyncStorage
  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('taskList');
      if (storedTasks) {
        setTaskList(JSON.parse(storedTasks));
      }
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
    }
  };

  // Salva as tarefas no AsyncStorage
  const storeTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('taskList', JSON.stringify(updatedTasks));
    } catch (err) {
      console.error('Erro ao salvar tarefas:', err);
    }
  };

  // Adiciona uma nova tarefa à lista
  const handleAddTask = () => {
    if (!inputText.trim()) return;

    const newTaskList = [...taskList, inputText];
    setTaskList(newTaskList);
    setInputText('');
    storeTasks(newTaskList);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Lista de Tarefas</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Digite uma tarefa..."
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      <FlatList
        data={taskList}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskBox}>
            <Text style={styles.taskText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  textInput: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskBox: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#555',
  },
});

export default TodoApp;
