import React from 'react';
import { Helmet } from 'react-helmet';
import { validateSchema } from '@/lib/SchemaValidator.js';

const SchemaMarkup = ({ schemas = [] }) => {
  if (import.meta.env.DEV) {
    schemas.forEach(validateSchema);
  }

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;