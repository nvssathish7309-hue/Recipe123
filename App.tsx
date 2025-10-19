import React, { useState, useCallback } from 'react';
import { View, SearchType, ResultsData, IngredientList } from './types';
import SearchPage from './components/SearchPage';
import ResultsPage from './components/ResultsPage';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import { findIngredientsForRecipe, findRecipesForIngredients } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SEARCH);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.RECIPE);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ResultsData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string, type: SearchType) => {
    setSearchQuery(query);
    setSearchType(type);
    setCurrentView(View.RESULTS);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      if (type === SearchType.RECIPE) {
        const storedRecipes: IngredientList[] = JSON.parse(localStorage.getItem('managedRecipes') || '[]');
        const foundRecipe = storedRecipes.find(r => r.recipeName.toLowerCase() === query.toLowerCase());

        if (foundRecipe) {
          setResults(foundRecipe);
          setIsLoading(false);
          return;
        }
      }

      let data: ResultsData;
      if (type === SearchType.RECIPE) {
        data = await findIngredientsForRecipe(query);
      } else {
        data = await findRecipesForIngredients(query);
      }
      setResults(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBack = () => {
    setCurrentView(View.SEARCH);
    setSearchQuery('');
    setResults(null);
    setError(null);
  };
  
  const navigateTo = (view: View) => {
    setCurrentView(view);
    handleBack(); 
  };
  
  const renderContent = () => {
    switch (currentView) {
      case View.SEARCH:
        return <SearchPage onSearch={handleSearch} />;
      case View.RESULTS:
        return (
          <ResultsPage
            searchType={searchType}
            searchQuery={searchQuery}
            results={results}
            isLoading={isLoading}
            error={error}
            onBack={handleBack}
          />
        );
      case View.ADMIN:
        return <AdminPage />;
      default:
        return <SearchPage onSearch={handleSearch} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
      <Header currentView={currentView} onNavigate={navigateTo} />
      <main className="container mx-auto px-4 py-12 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
