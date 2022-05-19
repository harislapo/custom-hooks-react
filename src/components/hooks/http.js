import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currentHttp, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.reqIdentifier,
      };
    case 'RESPONSE':
      return {
        ...currentHttp,
        loading: false,
        data: action.responseData,
        extra: action.extraData,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = () => {
    dispatchHttp({ type: 'CLEAR' });
  };
  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', reqIdentifier: identifier });

    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        dispatchHttp({
          type: 'RESPONSE',
          responseData: responseData,
          extraData: extra,
        });
      })
      .catch((error) => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  }, []);

  return {
    loading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    requestExtra: httpState.extra,
    requestIdentifier: httpState.identifier,
    clearError: clear,
    sendRequest: sendRequest,
  };
};

export default useHttp;
