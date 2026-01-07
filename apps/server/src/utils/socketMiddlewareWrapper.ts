import { Socket } from 'socket.io';
import { Request, Response } from 'express';

// Wrapper function that takes any Express-style middleware
export function wrapper(
  middleware: (req: Request, res: Response, next: (err?: any) => void) => void,
) {
  return function (socket: Socket, next: (err?: any) => void) {
    // Mock the Express `Request` object by extending `socket.request`
    const req: Request = {
      ...socket.request, // Spread the socket.request properties
      cookies: {}, // Initialize cookies (cookie-parser will populate this)
      header: (name: string) => socket.request.headers[name], // Mock header access
      get: (name: string) => socket.request.headers[name], // Mock get method for headers
    } as Request;

    // Create a mock response object for Express middleware
    const res: Response = {} as Response; // Placeholder, as it's not used in Socket.IO middleware

    // Apply the middleware (cookie-parser, or any other) to the mock request
    middleware(req, res, (err: any) => {
      if (err) {
        return next(err); // If there's an error, pass it to the next middleware
      }
      next(); // Proceed to next middleware
    });
  };
}
