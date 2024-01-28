export const handler = async (event: any, context: any): Promise<any> => {
  try {
    if (event.info.parentTypeName === 'Mutation') {
      switch (event.info.fieldName) {
        case 'subscribe':
          console.log("subscribe event")
      }
    }
  } catch (e) {
    console.log(e);
  }
};
