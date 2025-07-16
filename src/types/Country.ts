export interface CountryAPIResponse {
  name: { common: string };
  cca2: string;
  cca3: string;
  region?: string;
  subregion?: string;
  timezones?: string[];
}