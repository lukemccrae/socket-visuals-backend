export const handler = async (event: any, context: any): Promise<any> => {
  try {
    if (event.info.parentTypeName === 'Subscription') {
      switch (event.info.fieldName) {
        case 'subscribe2Notes':
          return {
            note: 0,
            velocity: 0.0
          };
      }
    }
  } catch (e) {
    console.log(e);
  }
};
