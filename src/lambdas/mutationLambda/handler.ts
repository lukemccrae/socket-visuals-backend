export const handler = async (event: any, context: any): Promise<any> => {
  try {
    if (event.info.parentTypeName === 'Mutation') {
      switch (event.info.fieldName) {
        case 'publishNote':
          return {
            note: event.arguments.note,
            velocity: event.arguments.velocity
          };
      }
    }
  } catch (e) {
    console.log(e);
  }
};
