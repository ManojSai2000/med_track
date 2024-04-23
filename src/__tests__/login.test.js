import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from '../pages/login';
import { BrowserRouter as Router } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        signInWithEmailAndPassword.mockReset();
    });

    const setup = () => {
        const utils = render(
            <Router>
                <Login />
            </Router>
        );
        const emailInput = utils.getByPlaceholderText('Email');
        const passwordInput = utils.getByPlaceholderText('Password');
        const submitButton = utils.getByRole('button', { name: /sign in/i });
        return {
            ...utils,
            emailInput,
            passwordInput,
            submitButton,
        };
    };

    it('submits the form and navigates on successful login', async () => {
        signInWithEmailAndPassword.mockResolvedValue({
            user: { uid: '123' },
        });

        const { emailInput, passwordInput, submitButton } = setup();
        fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                auth,
                'jane.doe@example.com',
                'password123'
            );
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays an error message on failed login', async () => {
        signInWithEmailAndPassword.mockRejectedValue(new Error('Failed to sign in'));

        const { emailInput, passwordInput, submitButton } = setup();
        fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });
});
