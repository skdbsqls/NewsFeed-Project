"use client";

export default function FilterError({ error }) {
  return (
    <div id="error">
      <h2>An error occurred!</h2>
      <pp>{error.message}</pp>
    </div>
  );
}
