import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const fetchDevices = async () => {
  try {
    const response = await axios.get(apiBaseUrl+'/devices');
    console.log('Response data:', response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching devices:', error.message);
    } else {
      console.error('Error fetching devices:', error);
    }
  }
};

const fecthStores = async () => {
  try {
    const response = await axios.get(apiBaseUrl+'/stores');
    console.log('Response data:', response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching devices:', error.message);
    } else {
      console.error('Error fetching devices:', error);
    }
  }
};

fecthStores();
