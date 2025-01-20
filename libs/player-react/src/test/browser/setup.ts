import * as matchers from '@testing-library/jest-dom/matchers';
import * as playwrightMatchers from '@vitest/browser/providers/playwright';
import { expect } from 'vitest';
import '@testing-library/jest-dom';
import 'vitest-browser-react';

expect.extend(matchers);
expect.extend(playwrightMatchers);
