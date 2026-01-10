import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { ENV } from './env';

export const google = createGoogleGenerativeAI({ apiKey: ENV.GOOGLE_API_KEY });
