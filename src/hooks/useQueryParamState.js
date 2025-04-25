import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Custom hook to sync state with URL query parameters
function useQueryParamState(paramName, defaultValue = '') {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to get initial state from URL or default
  const getInitialState = () => {
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get(paramName);
    if (paramValue === null) {
      return defaultValue;
    }
    // If the default value is an array, parse the param value
    if (Array.isArray(defaultValue)) {
      // Handle empty string case for array params correctly
      return paramValue ? paramValue.split(',') : [];
    }
    return paramValue;
  };

  const [value, setValue] = useState(getInitialState);

  // Update URL when state changes
  const updateQueryParam = useCallback((newValue) => {
    const newQueryParams = new URLSearchParams(location.search);
    // Check if the new value is different from the default
    const isDefault = JSON.stringify(newValue) === JSON.stringify(defaultValue);

    if (!isDefault) {
      // Special handling for arrays (e.g., multi-select specialties)
      if (Array.isArray(newValue)) {
        if (newValue.length > 0) {
          newQueryParams.set(paramName, newValue.join(','));
        } else {
          // Remove the param if the array is empty (back to default)
          newQueryParams.delete(paramName);
        }
      } else {
        // Handle non-array types
         newQueryParams.set(paramName, newValue);
      }
    } else {
       // If the value is the default, remove the param
      newQueryParams.delete(paramName);
    }
    // Use replace to avoid adding multiple history entries for filter changes
    navigate(`${location.pathname}?${newQueryParams.toString()}`, { replace: true });
  }, [paramName, location.search, location.pathname, navigate, defaultValue]);

  // Update state and URL
  const setStateAndQuery = useCallback((newValue) => {
    setValue(newValue);
    updateQueryParam(newValue);
  }, [updateQueryParam]);

  // Effect to update state if URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get(paramName); // Get the raw string value from URL

    if (Array.isArray(defaultValue)) {
      // Correctly parse the array value from the string OR use default empty array
      const urlValue = paramValue ? paramValue.split(',') : [];
      // Only update if the state value is actually different from the URL-derived value
      if (JSON.stringify(urlValue) !== JSON.stringify(value)) {
        setValue(urlValue);
      }
    } else {
      // For non-array types, get value from URL or use default
      const urlValue = paramValue === null ? defaultValue : paramValue;
       if (urlValue !== value) {
        setValue(urlValue);
      }
    }
    // Add 'value' to dependency array to correctly compare state vs URL derived value
  }, [location.search, paramName, defaultValue, value]);

  return [value, setStateAndQuery];
}

export default useQueryParamState;