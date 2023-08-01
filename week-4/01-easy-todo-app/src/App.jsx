import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

const client = axios.create({
  baseURL: 'http://localhost:3000/',
});

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  const toast = useToast();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await client.get('/todos');
        setTodos(data);
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTodos();
  }, []);

  const deleteTodo = async (todoId) => {
    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createTodo = async () => {
    try {
      const res = await client.post(
        '/todos',
        { ...newTodo, completed: false },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201) {
        newTodo.title = '';
        newTodo.description = '';
        setTodos([res.data, ...todos]);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container maxW={'container.lg'} h={'100%'} pt={12}>
        <Flex justify={'center'}>
          <Box width={'sm'}>
            <Heading as='h2' size='xl' textAlign={'center'} my={4}>
              TodoList
            </Heading>
            <Stack spacing={8}>
              <Input
                variant='flushed'
                placeholder='Title'
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
              <Input
                variant='flushed'
                placeholder='Description'
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />
              <Button colorScheme='blue' size={'md'} onClick={createTodo}>
                Add
              </Button>
            </Stack>
            <TodoList todoList={todos} onDelete={deleteTodo} />
          </Box>
        </Flex>
      </Container>
    </>
  );
}

const TodoItem = ({ todo, onDelete }) => {
  return (
    <Stack
      direction={'row'}
      justify={'space-between'}
      align={'center'}
      p={4}
      shadow={'md'}>
      <Text fontSize='xl' fontWeight={200}>
        {todo.title}
      </Text>
      <Button
        colorScheme='red'
        variant={'ghost'}
        size={'md'}
        onClick={() => onDelete(todo.id)}>
        Remove
      </Button>
    </Stack>
  );
};

const TodoList = ({ todoList, onDelete }) => {
  return (
    <Stack mt={8}>
      <Heading as='h3' size='md' textAlign={'center'} my={4}>
        Things to do
      </Heading>

      {todoList.length ? (
        <>
          {todoList.map((todo) => (
            <TodoItem todo={todo} key={todo.id} onDelete={onDelete} />
          ))}
        </>
      ) : (
        <Text textAlign={'center'} color={'gray.400'}>
          No todos found
        </Text>
      )}
    </Stack>
  );
};
export default App;
