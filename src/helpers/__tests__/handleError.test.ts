import { Response } from 'express';
import { httpError } from '../handleError';

describe('handleError', () => {
  let mockResponse: Partial<Response>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(function() { return this; }),
      json: jest.fn(function() { return this; }),
    } as any;
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should send 500 status code', () => {
    const error = new Error('Test error');
    httpError(mockResponse as Response, error);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  it('should send error JSON response', () => {
    const error = new Error('Test error');
    httpError(mockResponse as Response, error);

    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Algo ocurrió' });
  });

  it('should log the error', () => {
    const error = new Error('Test error');
    httpError(mockResponse as Response, error);

    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('should handle string errors', () => {
    const error = 'String error message';
    httpError(mockResponse as Response, error);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Algo ocurrió' });
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });
});
