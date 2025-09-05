# OVARC TASK

## Tech Stack
- **Vite**: Fast build tool and dev server.
- **React Router**: Dynamic routing with code splitting.
- **Tailwind CSS**: Utility-first CSS framework.


## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```  

## Features
1. **Shop Page**: 
   
   It has a list of cards containing the book cover page, title & author, and which stores this book is available in. The sell button should mark this as sold but keep the card on the page.

2. **Authors Page** 

   It has a simple list of authors and two CTAs to edit the name (in-line edit) or delete the author entirely. There is a CTA & a modal too for adding a new author.

3. **Books Page** 

   It has a list of books, the number of pages, and who the author is. The edit CTA is an in-line edit for the book title.

4. **Stores Page** 

   Same as the above two. The entire row is a CTA for the next page.

5. **Store Inventory Page**

   This is where the admin adds more books to the store’s
inventory. The books should be viewable either in a list view or grouped by the author via the tab selection. The add to inventory CTA pops up a modal to select the new book and set its price.

## Routes
- /: Home page with sections for Stores, Books, and Authors.
- /browse-stores: Browse all stores with their book counts and average prices.
- /browse: Browse all books with their authors and store availability.
- /browse-authors: Browse all authors with their published book counts.

## Code Review

### CSS Improvements
1. **Use rem instead of px for better accessibility**
   - Current issue: Fixed pixel values are used in multiple components (e.g., in Loading.jsx, Sidelist.jsx)
   - Recommendation: Convert all pixel values to rem units for better scaling and accessibility
   - Benefits: Improves accessibility for users with different screen sizes and font preferences

2. **Use CSS Modules or styled-components**
   - Current issue: Global CSS can lead to naming conflicts and specificity issues
   - Recommendation: Adopt CSS Modules (already partially implemented) or styled-components
   - Implementation: Create `.module.css` files for each component

3. **Implement responsive design**
   - Current issue: Some components don't adapt well to different screen sizes
   - Recommendation: Use more responsive utility classes and media queries

4. **Adopt a CSS naming convention**
   - Current issue: Inconsistent CSS class naming
   - Recommendation: Follow BEM (Block Element Modifier) or another naming convention
   - Example: `.book-card__title--highlighted` instead of `.highlighted-title`

### Data Fetching Improvements
1. **Replace fetch with axios**
   - Current issue: Native fetch API lacks features like request cancellation and automatic JSON parsing
   - Recommendation: Use axios for better error handling, request cancellation, and interceptors
   - Implementation: `npm install axios` and replace fetch calls with axios
   - Example: See the new `src/network/axiosConfig.js` for a configured axios instance

2. **Centralize API calls**
   - Current issue: API calls are scattered across components and hooks
   - Recommendation: Create a dedicated network folder with separate API files for each entity
   - Implemented structure: 
     - `src/network/axiosConfig.js`: Base axios configuration with interceptors
     - `src/network/bookApi.js`: Book-specific API methods
     - `src/network/authorApi.js`: Author-specific API methods
     - `src/network/storeApi.js`: Store-specific API methods
     - `src/network/inventoryApi.js`: Inventory-specific API methods
     - `src/network/index.js`: Export all API services

3. **Handle loading, error, and success states properly**
   - Current issue: In `useLibraryData.js`, there's no proper loading or error state management
   - Recommendation: Track loading and error states for each resource separately

4. **Prevent race conditions**
   - Current issue: In `useLibraryData.js`, multiple fetch calls in a single useEffect without cancellation
   - Recommendation: Use axios cancellation tokens and separate useEffect hooks for each resource

### State Management
1. **Implement proper state management**
   - Current issue: State is managed locally in components and through custom hooks
   - Recommendation: Use a state management library like Redux Toolkit or Zustand for complex state
   - Benefits: Centralized state, better debugging, and predictable state updates

2. **Separate UI state from data state**
   - Current issue: Mixing of UI state (like modal visibility) with data state
   - Recommendation: Keep UI state local to components and global data in state management
   - Implementation: Use Redux for data state and local useState for UI state

## Suggested Project Structure

### Current Structure
```
src/
  ├── components/       # Reusable UI components
  ├── hooks/            # Custom React hooks
  ├── pages/            # Page components
  ├── services/         # Mock server implementation
  └── App.jsx           # Main application component
```

### Recommended Domain-Driven Structure
```
src/
  ├── core/             # Core application code
  │   ├── config/       # Application configuration
  │   ├── hooks/        # Shared hooks
  │   ├── types/        # Shared TypeScript types
  │   └── utils/        # Shared utility functions
  ├── lib/              # External library wrappers
  │   └── axios/        # Axios configuration
  ├── network/          # API services
  │   ├── api/          # API endpoints by entity
  │   └── mock/         # Mock server implementation
  ├── store/            # State management
  │   ├── slices/       # Redux slices by domain
  │   └── index.js      # Store configuration
  ├── ui/               # UI components
  │   ├── components/   # Shared UI components
  │   └── layouts/      # Layout components
  ├── features/         # Feature modules
  │   ├── books/        # Book-related features
  │   │   ├── components/  # Book-specific components
  │   │   ├── hooks/       # Book-specific hooks
  │   │   └── pages/       # Book pages
  │   ├── authors/      # Author-related features
  │   ├── stores/       # Store-related features
  │   └── inventory/    # Inventory-related features
  └── App.jsx           # Main application component
```

### Benefits of Domain-Driven Structure
1. **Better organization**: Related code is grouped together by domain/feature
2. **Improved maintainability**: Changes to a feature are localized to its directory
3. **Easier navigation**: Developers can quickly find related code
4. **Better scalability**: New features can be added without affecting existing ones
5. **Clearer boundaries**: Dependencies between features are explicit

### Mock Server Implementation
1. **Environment variable for API source**
   - Current issue: No way to switch between mock and real API
   - Recommendation: Add environment variable to control data source
   - Example: `VITE_USE_MOCK_API=true` to toggle between mock and real API

2. **Consistent API structure**
   - Current issue: Direct JSON fetching doesn't mimic real API behavior
   - Recommendation: Create a mock server that simulates API endpoints
   - Tool suggestion: MSW (Mock Service Worker) for intercepting requests

### TypeScript Integration
Considering adding TypeScript for better type safety:

1. **Benefits**
   - Type checking for props and state
   - Better IDE support and autocompletion
   - Reduced runtime errors

2. **Implementation steps**
   - Add TypeScript dependencies
   - Create type definitions for data models
   - Gradually convert files from .jsx to .tsx

3. **Define interfaces for data models**
   - Current status: Limited type definitions
   - Recommendation: Create comprehensive interfaces for all data models


4. **Type React components and props**
   - Recommendation: Add TypeScript to React components


## Additional Recommendations
1. **Add unit and integration tests**
   - Current issue: No automated tests
   - Recommendation: Add Vitest and React Testing Library

2. **Implement form validation**
   - Current issue: Limited validation in forms
   - Recommendation: Use a form library like Formik or React Hook Form

3. **Improve accessibility**
   - Current issue: Missing ARIA attributes and keyboard navigation
   - Recommendation: Add proper ARIA roles and ensure keyboard accessibility


4. **Implement error boundaries**
   - Current status: No error boundaries
   - Recommendation: Add React Error Boundaries to prevent entire app crashes


