// export const updateAttributes = (object: any, path: string, newAttributes: any) => {
//   // Split the path into segments
//   const segments = path.split(".");

//   // Start with the root object
//   let current = object;

//   // Traverse the path and remove the element at the specified index
//   for (let i = 0; i < segments.length; i++) {
//     const segment = segments[i];
//     current = current[segment];
//   }

//   current.attributes = newAttributes;

//   return object;
// };


// export const updateContent = (object: any, path: string, newContent: any) => {
//   // Split the path into segments
//   const segments = path.split(".");

//   // Start with the root object
//   let current = object;

//   // Traverse the path and remove the element at the specified index
//   for (let i = 0; i < segments.length; i++) {
//     const segment = segments[i];
//     current = current[segment];
//   }

//   current.content = newContent;

//   return object;
// };
