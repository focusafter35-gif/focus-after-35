export const validateSchema = (schema) => {
  if (!schema) return;
  
  if (!schema['@context']) {
    console.warn('Schema validation warning: Missing @context property.', schema);
  }
  
  if (!schema['@type']) {
    console.warn('Schema validation warning: Missing @type property.', schema);
  }

  // Type-specific validation
  switch (schema['@type']) {
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        console.warn('FAQPage Schema warning: Missing or invalid mainEntity array.', schema);
      }
      break;
    case 'MedicalWebPage':
      if (!schema.name || !schema.description || !schema.url) {
        console.warn('MedicalWebPage Schema warning: Missing name, description, or url.', schema);
      }
      if (!schema.medicalAudience) {
        console.warn('MedicalWebPage Schema warning: Missing medicalAudience.', schema);
      }
      if (!schema.disclaimer) {
        console.warn('MedicalWebPage Schema warning: Missing medical disclaimer.', schema);
      }
      break;
    case 'BreadcrumbList':
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        console.warn('BreadcrumbList Schema warning: Missing or invalid itemListElement array.', schema);
      }
      break;
    default:
      break;
  }
};