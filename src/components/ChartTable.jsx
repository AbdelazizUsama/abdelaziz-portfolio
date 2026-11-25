import React from 'react';

// Screen-reader alternative for a chart: the same numbers as a (visually hidden) table.
export default function ChartTable({ title, labels, values, suffix = '' }) {
  return (
    <table className="sr-only">
      <caption>{title}</caption>
      <tbody>
        {labels.map((label, i) => (
          <tr key={`${label}-${i}`}>
            <th scope="row">{label}</th>
            <td>{Number(values[i]).toLocaleString('en-US')}{suffix}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
