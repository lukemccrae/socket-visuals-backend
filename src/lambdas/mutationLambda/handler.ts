export const handler = async (event: any, context: any): Promise<any> => {
  try {
    console.log(event, '<< event');
    if (event.info.parentTypeName === 'Mutation') {
      switch (event.info.fieldName) {
        case 'publish2channel':
          const returnMe = {
            name: event.arguments.name,
            data: event.arguments.data
          };
          console.log(returnMe, '< returnme');
          return returnMe;
      }
    }
  } catch (e) {
    console.log(e);
  }
};
