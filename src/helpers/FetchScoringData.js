import axios from 'axios';

import getStatgritUrl from './GetStatgritUrl';
export const FetchScoringData = async (url) => {
  try {
    const API_URL = getStatgritUrl;

    const response = await axios.get(`${API_URL}${url}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
