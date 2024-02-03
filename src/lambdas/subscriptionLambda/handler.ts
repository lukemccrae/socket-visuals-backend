export const handler = async (event: any, context: any): Promise<any> => {
  try {
    if (event.info.parentTypeName === 'Subscription') {
      switch (event.info.fieldName) {
        case 'subscribe2channel':
          return {
            name: 'name',
            data: 'data'
          };
      }
    }
  } catch (e) {
    console.log(e);
  }
};
