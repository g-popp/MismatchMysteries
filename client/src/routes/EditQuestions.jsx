import React, { forwardRef, useRef, useState } from 'react';
import {
    Trash2,
    Edit,
    Check,
    ToggleLeft,
    ToggleRight,
    X,
    Eye,
    EyeOff
} from 'lucide-react';

import { defaultQuestions } from '../defaultQuestions';

const Button = ({
    children,
    className = '',
    variant = 'default',
    size = 'default',
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    const variantStyles = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    const sizeStyles = {
        default: 'h-10 py-2 px-4',
        icon: 'h-10 w-10'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const ScrollArea = forwardRef(({ className = '', children }, ref) => {
    return (
        <div ref={ref} className={`overflow-auto ${className}`}>
            {children}
        </div>
    );
});
ScrollArea.displayName = 'ScrollArea';

const Textarea = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

const Modal = ({ isOpen, onClose, onConfirm, questionId }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-xl max-w-sm w-full'>
                <h2 className='text-xl font-bold mb-4'>Confirm Deletion</h2>
                <p className='mb-6'>
                    Are you sure you want to delete Question {questionId}?
                </p>
                <div className='flex justify-end space-x-4'>
                    <Button
                        onClick={onClose}
                        className='bg-gray-300 hover:bg-gray-400 text-black'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className='bg-red-500 hover:bg-red-600 text-white'
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

const PasswordProtection = ({ onCorrectPassword }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        if (password === 'Test1234!') {
            onCorrectPassword();
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className='fixed inset-0 bg-orange-100 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-lg shadow-xl max-w-sm w-4/5'>
                <h2 className='text-2xl font-bold mb-6 text-center text-orange-800'>
                    Password Required
                </h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                            placeholder='Enter password'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2'
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <Button
                        type='submit'
                        className='w-full bg-orange-500 hover:bg-orange-600 text-white'
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
};

const EditQuestions = () => {
    const [questions, setQuestions] = useState(defaultQuestions);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const scrollAreaRef = useRef(null);

    const addQuestion = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
        const newId = Math.max(0, ...questions.map(q => q.id)) + 1;
        setQuestions([
            ...questions,
            { id: newId, text: '', isEditing: true, isActive: true }
        ]);
    };

    const updateQuestion = (id, text) => {
        setQuestions(questions.map(q => (q.id === id ? { ...q, text } : q)));
    };

    const openDeleteModal = id => {
        setQuestionToDelete(id);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setQuestionToDelete(null);
    };

    const confirmDelete = () => {
        if (questionToDelete !== null) {
            setQuestions(questions.filter(q => q.id !== questionToDelete));
            closeDeleteModal();
        }
    };

    const toggleEdit = id => {
        setQuestions(
            questions.map(q =>
                q.id === id ? { ...q, isEditing: !q.isEditing } : q
            )
        );
    };

    const toggleActive = id => {
        setQuestions(
            questions.map(q =>
                q.id === id ? { ...q, isActive: !q.isActive } : q
            )
        );
    };

    if (!isAuthenticated) {
        return (
            <PasswordProtection
                onCorrectPassword={() => setIsAuthenticated(true)}
            />
        );
    }

    return (
        <div className='flex flex-col items-center w-full'>
            <h1 className='text-xl underline mb-2'>Edit Question Pack</h1>
            <ScrollArea
                ref={scrollAreaRef}
                className='h-[calc(75vh-10rem)] mt-6 w-full'
            >
                {questions.map((question, index) => (
                    <div
                        key={question.id}
                        className={`mb-4 p-4 rounded-lg transition-colors duration-200 ${
                            question.isActive ? 'bg-orange-50' : 'bg-gray-200'
                        }`}
                    >
                        <div className='flex justify-between items-center mb-2'>
                            <h2
                                className={`text-lg font-semibold ${
                                    question.isActive
                                        ? 'text-orange-800'
                                        : 'text-gray-600'
                                }`}
                            >
                                Question {index + 1}
                            </h2>
                            <div className='flex space-x-2'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => toggleActive(question.id)}
                                    className={`${
                                        question.isActive
                                            ? 'text-green-500 hover:text-green-700 hover:bg-green-100'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {question.isActive ? (
                                        <ToggleRight className='h-5 w-5' />
                                    ) : (
                                        <ToggleLeft className='h-5 w-5' />
                                    )}
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => toggleEdit(question.id)}
                                    className='text-blue-500 hover:text-blue-700 hover:bg-blue-100'
                                    disabled={!question.isActive}
                                >
                                    {question.isEditing ? (
                                        <Check className='h-5 w-5' />
                                    ) : (
                                        <Edit className='h-5 w-5' />
                                    )}
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => openDeleteModal(question.id)}
                                    className='text-red-400 hover:text-red-600 hover:bg-red-100'
                                >
                                    <Trash2 className='h-5 w-5' />
                                </Button>
                            </div>
                        </div>
                        {question.isEditing ? (
                            <Textarea
                                value={question.text}
                                onChange={e =>
                                    updateQuestion(question.id, e.target.value)
                                }
                                placeholder='Enter your question'
                                className='min-h-[100px] text-base'
                            />
                        ) : (
                            <p
                                className={`text-base break-words ${
                                    question.isActive
                                        ? 'text-gray-700'
                                        : 'text-gray-500'
                                }`}
                            >
                                {question.text || 'No question text'}
                            </p>
                        )}
                    </div>
                ))}
            </ScrollArea>
            <button
                onClick={addQuestion}
                className='w-3/4 text-center text-xl py-4 px-6 rounded bg-blue-300 hover:bg-blue-400 border-blue-400 border-2 text-white transition bowlby-one fixed bottom-5'
            >
                Add New Question
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                questionId={questionToDelete || 0}
            />
        </div>
    );
};

export default EditQuestions;
