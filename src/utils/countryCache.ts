import { fetchAllCountries, CountryIdentifiers } from '../services/CountryService.js';

let cachedCountries: CountryIdentifiers[] = [];

export const loadCountries = async () => {
  cachedCountries = await fetchAllCountries();
};

export const resolveCountry = (input: string): CountryIdentifiers | null => {
  const normalized = input.trim().toUpperCase();

  return (
    cachedCountries.find((country) =>
      country.name.toUpperCase() === normalized ||
      country.cca2.toUpperCase() === normalized ||
      country.cca3.toUpperCase() === normalized
    ) ?? null
  );
};