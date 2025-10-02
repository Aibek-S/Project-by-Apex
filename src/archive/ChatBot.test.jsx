import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../ChatBot';

// Mock the geminiClient
jest.mock('../../utils/geminiClient', () => ({
  sendGeminiMessage: jest.fn()
}));

const { sendGeminiMessage } = require('../../utils/geminiClient');

describe('ChatBot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sends message and displays response', async () => {
    // Mock the API response
    sendGeminiMessage.mockResolvedValue('Hello! How can I help you today?');

    // Render the component
    render(<ChatBot />);

    // Get the input and send button
    const input = screen.getByLabelText('Type your message');
    const sendButton = screen.getByLabelText('Send message');

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello Gemini!' } });

    // Click send button
    fireEvent.click(sendButton);

    // Check that the user message is displayed
    expect(screen.getByText('Hello Gemini!')).toBeInTheDocument();

    // Check that the loading indicator appears
    expect(screen.getByText('...')).toBeInTheDocument();

    // Wait for the response
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    });

    // Check that the loading indicator is gone
    expect(screen.queryByText('...')).not.toBeInTheDocument();

    // Verify the API was called with the correct message
    expect(sendGeminiMessage).toHaveBeenCalledWith('Hello Gemini!');
  });

  test('shows error message when API call fails', async () => {
    // Mock the API to throw an error
    sendGeminiMessage.mockRejectedValue(new Error('API Error'));

    // Render the component
    render(<ChatBot />);

    // Get the input and send button
    const input = screen.getByLabelText('Type your message');
    const sendButton = screen.getByLabelText('Send message');

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello Gemini!' } });

    // Click send button
    fireEvent.click(sendButton);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables send button when input is empty', () => {
    render(<ChatBot />);

    const sendButton = screen.getByLabelText('Send message');

    // Button should be disabled initially
    expect(sendButton).toBeDisabled();

    // Type a message
    const input = screen.getByLabelText('Type your message');
    fireEvent.change(input, { target: { value: 'Hello' } });

    // Button should be enabled
    expect(sendButton).not.toBeDisabled();

    // Clear the input
    fireEvent.change(input, { target: { value: '' } });

    // Button should be disabled again
    expect(sendButton).toBeDisabled();
  });
});