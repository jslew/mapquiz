// Geographic coordinates for countries and cities
// Coordinates are approximate center points for countries and exact locations for cities

export const countries = [
  { name: "Afghanistan", x: 67.7, y: 33.9 },
  { name: "Argentina", x: -63.6, y: -38.4 },
  { name: "Australia", x: 133.8, y: -25.3 },
  { name: "Bangladesh", x: 90.4, y: 23.7 },
  { name: "Belarus", x: 27.9, y: 53.7 },
  { name: "Belgium", x: 4.5, y: 50.5 },
  { name: "Brazil", x: -51.9, y: -14.2 },
  { name: "Canada", x: -106.3, y: 56.1 },
  { name: "China", x: 104.2, y: 35.9 },
  { name: "Egypt", x: 30.8, y: 26.8 },
  { name: "France", x: 2.2, y: 46.2 },
  { name: "Germany", x: 10.5, y: 51.2 },
  { name: "India", x: 78.9, y: 20.6 },
  { name: "Indonesia", x: 113.9, y: -0.8 },
  { name: "Italy", x: 12.6, y: 41.9 },
  { name: "Japan", x: 138.3, y: 36.2 },
  { name: "Kyrgyzstan", x: 74.8, y: 41.2 },
  { name: "Mali", x: -3.9, y: 17.6 },
  { name: "Mexico", x: -102.6, y: 23.6 },
  { name: "Netherlands", x: 5.3, y: 52.1 },
  { name: "Nigeria", x: 8.7, y: 9.1 },
  { name: "North Korea", x: 127.5, y: 40.3 },
  { name: "Pakistan", x: 69.3, y: 30.4 },
  { name: "Poland", x: 19.1, y: 51.9 },
  { name: "Russia", x: 105.3, y: 61.5 },
  { name: "Saudi Arabia", x: 45.1, y: 23.9 },
  { name: "Somalia", x: 46.2, y: 5.2 },
  { name: "South Africa", x: 22.9, y: -30.6 },
  { name: "South Korea", x: 127.8, y: 35.9 },
  { name: "Spain", x: -3.7, y: 40.5 },
  { name: "Sri Lanka", x: 80.8, y: 7.9 },
  { name: "Sweden", x: 18.6, y: 60.1 },
  { name: "Switzerland", x: 8.2, y: 46.8 },
  { name: "Thailand", x: 100.9, y: 15.9 },
  { name: "Turkey", x: 35.2, y: 38.9 },
  { name: "United Kingdom", x: -3.4, y: 55.4 },
  { name: "United States", x: -95.7, y: 37.1 },
  { name: "Vietnam", x: 108.3, y: 14.1 },
  { name: "Yemen", x: 48.5, y: 15.6 }
];

export const cities = [
  { name: "Amsterdam", x: 4.9, y: 52.4 },
  { name: "Bangkok", x: 100.5, y: 13.8 },
  { name: "Beijing", x: 116.4, y: 39.9 },
  { name: "Berlin", x: 13.4, y: 52.5 },
  { name: "Chicago", x: -87.6, y: 41.9 },
  { name: "Dubai", x: 55.3, y: 25.2 },
  { name: "Frankfurt", x: 8.7, y: 50.1 },
  { name: "Hong Kong", x: 114.2, y: 22.3 },
  { name: "Istanbul", x: 28.9, y: 41.0 },
  { name: "Johannesburg", x: 28.0, y: -26.2 },
  { name: "London", x: -0.1, y: 51.5 },
  { name: "Los Angeles", x: -118.2, y: 34.1 },
  { name: "Mexico City", x: -99.1, y: 19.4 },
  { name: "Milan", x: 9.2, y: 45.5 },
  { name: "Mumbai", x: 72.9, y: 19.1 },
  { name: "New York City", x: -74.0, y: 40.7 },
  { name: "Paris", x: 2.4, y: 48.9 },
  { name: "San Francisco", x: -122.4, y: 37.8 },
  { name: "Seoul", x: 126.9, y: 37.6 },
  { name: "Shanghai", x: 121.5, y: 31.2 },
  { name: "Singapore", x: 103.8, y: 1.3 },
  { name: "Sydney", x: 151.2, y: -33.9 },
  { name: "Tokyo", x: 139.7, y: 35.7 },
  { name: "Toronto", x: -79.4, y: 43.7 },
  { name: "Zurich", x: 8.5, y: 47.4 }
];

// Convert longitude/latitude to SVG coordinates
// World map bounds: -180 to 180 longitude, -90 to 90 latitude
// SVG viewBox: 0 0 800 400
export const convertToSVG = (lon, lat) => {
  const x = ((lon + 180) / 360) * 800;
  const y = ((90 - lat) / 180) * 400;
  return { x, y };
};
