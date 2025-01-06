import axios from 'axios';

const fetchDevices = async () => {
  try {
    const response = await axios.get('http://localhost:5000/devices');
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
    const response = await axios.get('http://localhost:5000/stores');
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
