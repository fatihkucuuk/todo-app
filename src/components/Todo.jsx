import React, { useRef, useState, useEffect } from 'react';
import todoicon from '../assets/todoicon.png';
import TodoItems from './TodoItems';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Todo = () => {

    // LOCAL STORAGE'DAN BAŞLANGIÇTA OKUMA
    const [todoList, setTodoList] = useState(() => {
        const saved = localStorage.getItem("todos");
        return saved ? JSON.parse(saved) : [];
    });

    const [filter, setFilter] = useState('all');
    const inputRef = useRef();

    // LOCAL STORAGE'A KAYDET
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todoList));
    }, [todoList]);

    // COMPLETE
    const toggleComplete = (id) => {
        setTodoList(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
            )
        );
    };

    // DELETE
    const deleteTodo = (id) => {
        setTodoList(prev => prev.filter(todo => todo.id !== id));
    };

    // UPDATE
    const updateTodo = (id, newText) => {
        setTodoList(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, text: newText } : todo
            )
        );
    };

    // ADD
    const add = () => {
        const inputText = inputRef.current.value.trim();
        if (!inputText) return;

        const newTodo = {
            id: Date.now(),
            text: inputText,
            isComplete: false
        };

        setTodoList(prev => [...prev, newTodo]);
        inputRef.current.value = "";
    };

    // TASK COUNTER
    const completed = todoList.filter(t => t.isComplete).length;
    const pending = todoList.length - completed;

    // FILTER
    const filteredTodos = todoList.filter(todo => {
        if (filter === 'completed') return todo.isComplete;
        if (filter === 'pending') return !todo.isComplete;
        return true;
    });

    // DRAG DROP
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(todoList);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);

        setTodoList(items);
    };

    return (
        <div className='bg-white w-11/12 max-w-md place-self-center flex flex-col p-7 rounded-xl shadow-lg min-h-150'>

            {/* HEADER */}
            <div className='flex items-center gap-4 mb-6'>
                <img className='w-12 h-12' src={todoicon} alt="Todo Icon" />
                <h1 className='text-3xl font-semibold'>To-Do List</h1>
            </div>

            {/* INPUT */}
            <div className='flex items-center mb-5 bg-gray-100 rounded-full overflow-hidden shadow-inner'>
                <input
                    ref={inputRef}
                    className='flex-1 h-14 px-5 bg-transparent outline-none'
                    type="text"
                    placeholder='Add your task'
                />

                <button
                    onClick={add}
                    className='w-32 h-14 bg-orange-600 text-white font-semibold hover:bg-orange-700'
                >
                    ADD +
                </button>
            </div>

            {/* TASK COUNTER */}
            <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{pending} tasks left</span>
                <span>{completed} completed</span>
            </div>

            {/* FILTER */}
            <div className="flex justify-around mb-6">
                {['all', 'pending', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors
                        ${filter === f
                                ? f === 'completed'
                                    ? 'bg-green-500 text-white'
                                    : f === 'pending'
                                        ? 'bg-yellow-400 text-white'
                                        : 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Completed'}
                    </button>
                ))}
            </div>

            {/* DRAG DROP LIST */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todos">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="max-h-80 overflow-y-auto"
                        >
                            {filteredTodos.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id.toString()}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TodoItems
                                                id={item.id}
                                                text={item.text}
                                                isComplete={item.isComplete}
                                                toggleComplete={toggleComplete}
                                                deleteTodo={deleteTodo}
                                                updateTodo={updateTodo}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

        </div>
    );
};

export default Todo;