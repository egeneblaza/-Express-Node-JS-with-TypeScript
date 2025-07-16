import axios from 'axios';
import { CountryAPIResponse } from '../types/Country.js';

const COUNTRY_API_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca2,cca3';

export interface CountryIdentifiers {
  name: string;
  cca2: string;
  cca3: string;
  timezones?: string[];
}

export const fetchAllCountries = async (): Promise<CountryIdentifiers[]> => {
  try {
    const { data } = await axios.get<CountryAPIResponse[]>(COUNTRY_API_URL);

    const countries: CountryIdentifiers[] = data.map((country) => ({
      name: country.name.common,
      cca2: country.cca2,
      cca3: country.cca3,
      timezones: country.timezones,
    }));

    return countries.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}