// Enable React features used by Client Components.
"use client";

// Import React functions.
import { useEffect, useState } from "react";

// This component displays our page.
export default function Home() {
  // temperature contains the text displayed on the page.
  // setTemperature changes this text and updates the display.
  const [temperature, setTemperature] = useState("Loading…");

  // Read the environment label.
  // Use "unset" if the variable is missing.
  const label = process.env.NEXT_PUBLIC_ENV_LABEL ?? "unset";

  // Run this function in the browser after the initial render.
  useEffect(function () {
    // Define our function for requesting the weather.
    // "async" allows us to use "await".



    async function getTemp() {
      try {
        // Read the public environment variables.
        // Only use a FAKE API key for this exercise.
        const apiKey = process.env.NEXT_PUBLIC_DATA_API_KEY;
        const lat = process.env.NEXT_PUBLIC_CITY_LAT;
        const lon = process.env.NEXT_PUBLIC_CITY_LON;

        // Check that all required variables exist.
        if (!apiKey || !lat || !lon) {
          throw new Error("Missing environment variables");
        }

        // Build the URL using the latitude and longitude.
        // ${...} inserts a variable into a string with backticks.
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m`;

        // Send a request directly from the browser to Open-Meteo.
        // The fake API key is included in the request headers.
        const response = await fetch(url, {
          headers: {
            "X-API-Key": apiKey,
          },
        });

        // Check whether the HTTP request was successful.
        if (!response.ok) {
          throw new Error("Weather API request failed");
        }

        // Convert the JSON response into a JavaScript object.
        const data = await response.json();

        // Read the temperature from Open-Meteo's response.
        const value = data.current.temperature_2m;

        // Update the text displayed on the page.
        setTemperature(value + " °C");
      } catch (error) {
        // Log the error in the browser console for debugging.
        console.error(error);

        // Display a simple error message.
        setTemperature("Unable to retrieve the weather");
      }
    }

    // Execute the function defined above.
    getTemp();

    // No dependencies: temperature updates will not rerun this effect.
  }, []);

  // Return the JSX describing the page.
  // Curly braces insert JavaScript values into the display.
  return (
    <main style={{ fontFamily: "system-ui", padding: 40 }}>
      <div
        style={{
          padding: 12,
          background: label === "production" ? "#fee" : "#eef",
        }}
      >
        environment: {label}
      </div>

      <h1>{temperature}</h1>
      <p>Preview deployment test - with leaks</p>
      <p>Preview deployment test - version 2</p>
    </main>
  );
}
